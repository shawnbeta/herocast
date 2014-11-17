<?php
/**
 * This source file is part of HeroCast.
 *
 * HeroCast is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HeroCast is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with HeroCast. If not, see <http://www.gnu.org/licenses/lgpl-3.0.html>.
 *
 * PHP Version >=5.4
 *
 * @category HC_App
 * @package  module/Subscription
 * @author   Shawn Williams <shawnbeta@outlook.com>
 * @license  GNU/LGPL http://www.gnu.org/licenses/lgpl-3.0.html
 * @link     http://herocast.shawnbeta.com
 */


namespace Subscription\Service;

use Security\Service\SecurityService;
use Subscription\Entity\EpisodeEntity;
use Subscription\Service\FeedService;
use Subscription\Service\YoutubeService;
use Application\Service\BaseService;

require_once 'vendor/zendmedia/Zend/Media/Id3v2.php';

class EpisodeService extends BaseService {
    
    public function __construct($sm, $om)
    {
        $this->sm = $sm;
        $this->om = $om;
    }
	
	public function copyToServer($episode)
	{
	    
		$subscription = $episode->__get('subscription');
		$src = $episode->__get('src');
		
		// Get the config data for the webroot
		$config = SecurityService::getConfig();
		$fileRoot = $config['file_root'];
		$srcRoot = $config['src_root'];
		
        // Path to file on machine
		$path = $fileRoot . $subscription->__get('title');
	
		$ext = pathinfo($src, PATHINFO_EXTENSION);
		$file_name = pathinfo($src, PATHINFO_FILENAME);
	
		$file_location = $path . '/' . $file_name . '.' . $ext;
	
		if (!file_exists($path)) {
			mkdir($path, 0755, true);
		}
	
		// Move the podcast content to the server.
		file_put_contents($file_location, fopen($src, 'r'));
	
		// PHP Reader: https://code.google.com/p/php-reader/
		//Now get and move the image from the file if any
		try {
			$id3 = new \Zend_Media_Id3v2($file_location);
		} catch (\Exception $e) {
			
		}
		
		$new_src = $srcRoot . $subscription->__get('title') . '/' . $file_name . '.' . $ext;
		
		$episode->__set('src', $new_src);
		
		if(isset($id3)){
		    
		    try{
		        $type = explode("/", $id3->apic->mimeType, 2);
		        
		        if(($handle = fopen($image = $fileRoot . $subscription->__get('title') . "/"
		            . $file_name .  "." . $type[1], "wb"))!== false){
		            if (fwrite($handle, $id3->apic->imageData,
		                $id3->apic->imageSize) != $id3->apic->imageSize);
		            fclose($handle);
		            $new_location = $srcRoot . $subscription->__get('title') . '/' . $file_name .  "." . $type[1];
		        
		            // Now update the episode with the new image location
		            $episode->__set('image', $new_location);
		        
		        };
		    }catch(\Exception $e){
		        $err = "Something went wrong with file import.\n";
		        $err .= $e;
		        error_log($e, 3, 'logs/episode_log');
		    }

		}
		$this->om->persist($episode);
		$this->om->flush();
		
		return array('success' => true);
	}	
	
	// Set params to null in case of refresh.
	public function get($page, $subscription)
	{

	    // Pager Info
	    // Change listings per page below.
	    $page_count = 25;
	    
	    // Calculate the starting position for
	    // the pager.
	    $start = $page_count * $page;

	    // Get all the Episodes
	    $ep_repo = $this->getAll();

	    // Count all the episodes for the pager.
	    $ep_count = count($ep_repo);	    
	    
	    // If there are no episodes prompt user to add subscriptions
	    if($ep_count === 0){
	        return array(
	            'success' => false,
	            'message' => 'You don\'t have any episodes. To see episodes
     		please add a <a href="#add-subscription">Subscription</a>.'
	        );
	    }
	    
	    // Get episodes by pagination
	    $rsp = $this->om->getRepository('Subscription\Entity\EpisodeEntity')
	       ->getByPager($subscription, $page, $page_count, $this->om);
	    
	    // Iterate over episodes to ready for JS.
        $episodes = $this->episodeCleaner($rsp);
	    
	    // Calculate the total number of pager
	    // links by dividing episode count
	    // by page count dropping remainder.
	    $link_count = ceil($ep_count / $page_count);	    	    
	    
	    return array(
	        'success' => true,
	        'episodes' => $episodes,
	        'page_count' => $link_count,
	    );
	}

	public function getAll()
	{
	    return $this->om->getRepository('Subscription\Entity\EpisodeEntity')
	       ->findAll();
	}
	
	public function getOne($id)
	{
	    return $this->om->getRepository('Subscription\Entity\EpisodeEntity')
	    ->find(array('id' => $id));
	}
	
	public function set($episodes)
	{
	    foreach ($episodes as $episode) {
	        $this->om->persist($episode);
	    }
	    $this->om->flush();  
	    
	    return $episodes;
	}
	
	public function iterateFeedEpisodes($fd, $lu, $subscription)
	{
	    
	    // Create the episode data array
	    // which will hold the response
	    $episodeData = array();
	    
	    // Iterate over feed data 
	    foreach ($fd->get_items() as $item) {
	        	
	        //Make pubdate var for readability.
	        $pubdate = new \DateTime($item->get_date());
	        	
	        // Add episodes older then the last update
	        // or newest episode pubdate
	        if($pubdate > $lu){
                $episode = $this->setFeedEpisodeFields($item, $subscription, $pubdate);
                $episodeData[] = $this->feedFieldFallback($episode);
                
                //Now check to see if subscription is autodownload
                if($subscription->__get('download'))
                    $this->copyToServer($episode);
	        }
	        	

	    }
	    
	    return $episodeData;
	}
	
	public function setFeedEpisodeFields($item, $subscription, $pubdate)
	{
	    $episode = new EpisodeEntity();
	    $episode->__set('title', $item->get_title());
	    $episode->__set('overview', $item->get_description());
	    $episode->__set('src', $item->get_enclosure()->get_link());
	    $episode->__set('pub_date', $pubdate);
	    $episode->__set('create_date', new \DateTime("now"));
	    $episode->__set('subscription', $subscription);
	    
	    return $episode;
	}
	
	public function setYouTubeFields($ed, $lu, $subscription)
	{
	    // Turn JSON into an array of objects.
	    $youtube_data = json_decode($ed);

	   // Iterate over each item in the Youtube response.
	    foreach ($youtube_data->items as $item){
	        $snippet = $item->snippet;
	        	
	        //Make pubdate var for readability.
	        $pubdate = new \DateTime($snippet->publishedAt);
	
	        //$details = $item->contentDetails;
	        if(isset($snippet->title)
	            && new \DateTime($snippet->publishedAt)  > $lu
	            && isset($item->contentDetails->upload->videoId)){
	            $episode = new EpisodeEntity();
	            $episode->__set('title', $snippet->title);
	            $episode->__set('overview', $snippet->description);
	            $episode->__set('src', $item->contentDetails->upload->videoId);
	            $episode->__set('pub_date', $pubdate);
	            $episode->__set('create_date', new \DateTime('now'));
	            $episode->__set('subscription', $subscription);
	        }
	        $episodeData[] = $episode;
	    }
	
	    return $episodeData;
	
	}	
	
	public function feedFieldFallback($episode)
	{
	    // Use Zend Feed reader if simple pie returns empty fields
	    if($episode->__get('title') === null)
	        $episode->__set('title', $this->getZendData()-> getTitle());
	    if($episode->__get('overview') === null)
	        $episode->__set('overview', $this->getZendData()-> getDescription());
	    if($episode->__get('pub_date') === null)
	        $episode->__set('pub_date', new \DateTime($this->getZendData()-> getDateCreated()));
	    if($episode->__get('src') === null)
	        $episode->__set('src', $this->getZendData()-> getLink());
	    return $episode;
	}
	
	public function getLatestEpisode()
	{
	    return $this->om->getRepository('Subscription\Entity\EpisodeEntity')
	       ->getLatestEpisode($this->om);
	}
	
	public function setWatched($params)
	{
	    
	    // Get the option
	    $option = $params['option'] == 'false' ? false : true;
	    
        $episode = $this->getOne($params['id']);
        $episode->__set('watched', $option);
        
        $this->om->persist($episode);
        $this->om->flush($episode);
        
        return array('msg' => 'Changes saved.' , 'success' => true);
	}
	
	public function setBookmark($params)
	{

	    $episode = $this->getOne($params['id']);
	    $episode->__set('bookmark', $params['option']);
	
	    $this->om->persist($episode);
	    $this->om->flush($episode);
	
	    $success = $episode->__get('bookmark') == $params['option'] ? true : false;
	    
	    return array('success' => $success);
	}	
	
	public function deleteByAge()
	{
	    $config = SecurityService::getConfig();
	    $tmp_date = new \DateTime('now -' .$config['delete_after'] .'weeks');
	    $age = $tmp_date->format("Y-m-d H:i:s");
	    
	    // Build the statment by all or specific subscription
	    $stmt = 	'DELETE e FROM Subscription\Entity\EpisodeEntity e';
	    $stmt .= ' WHERE e.pub_date < :age';
	    
	    // Run the custom query to get results
	    // from all subscriptions order by date.
	    $query = $this->om->createQuery($stmt);
	    
	    // Insert the age from the config file.
	    $query->setParameter('age', $age);
	    
	    $result = $query->getResult();
	    
	}
	
	public function refresh()
	{
	    // Get the latest published episode
	    // for each of the subscriptions.
	    $subscriptions = $this->getLatestEpisode();

	    foreach ($subscriptions as $s){
	        
	        // Get the subscripiton by id for the current iteration.
            $subscription = $this->om->getRepository('Subscription\Entity\SubscriptionEntity')
                ->find(array('id' => $s['s_id']));
                
	        // Get the date of the most recent episode
	       $lu = new \DateTime($s['last_update']);
	        
	        // Add the subscription and src to the data array
	        // It's setup this way so it works both existing
	        // and new subscriptions.
	        $src =  $subscription->__get('src');
	    
	        // Conditional depending on subscription type
	        if($s['s_type'] != 'youtube'){
	             
	            // Get current feed data
	            $fs = new FeedService();
	            $fd = $fs->getFeedData($src);
	    
	            // Get the new episodes from the feed data
	            $episodes = $this->iterateFeedEpisodes($fd, $lu, $subscription);
	    
	        }else{
	    
	            // Make the youtube servcie
	            $ys = new YoutubeService();
	    
	            // Get current youtube data from subscripiton src
	            $ed = $ys->getEpisodeData($src);
	            	
	            // Set the episode objects and fields.
	            $episodes = $this->setYouTubeFields($ed, $lu, $subscription);
	            	
	        }
	    
	        // Save new episodes.
	        $this->set($episodes);
	        	        
	        $rsp = array(
	           'msg'=> !empty($episodes) ? 'Episodes Refreshed!' : 'Nothing new.',
	           'success'=> isset($episodes) ? false : true,
	        );
	        
	        // If there are new episodes append
	        // episode data to the response array.
	        if(!empty($episodes))
	            return $this->get(1, false);
	    
	    }
	}
	
	
	public function episodeCleaner($rsp)
	{
	    
	    $episodes = array();
	    
	    // Iterate over the episode response
	    // to make an array of each object to send
	    // out as json.
	    foreach ($rsp as $val => $e){
	
	        // Format the publish date field
	        // so it plays nice with javascript.
	        $e->__set('pub_date', date_format($e->__get('pub_date'), 'c'));
	
	        // Set the subscription id for
	        // the current episode.
	        $e->__set('subscription', $e->__get('subscription')->__get('id'));
	
	        // Save the converted obj/array
	        // to the episode array.
	        $episodes[] = $e->getArrayCopy();
	    }
	    return $episodes;
	}
}

?>
