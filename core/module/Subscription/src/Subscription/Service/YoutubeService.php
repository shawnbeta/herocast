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
use Utility\Service\FileService;
use Subscription\Entity\SubscriptionEntity;
use Application\Service\BaseService;

class YoutubeService extends BaseService{

	protected $youtube_key;
	
	public function getYoutubeKey()
	{
		// Get the YouTube key from the config file
		if($this->youtube_key === null)
		    
			$this->youtube_key = SecurityService::getConfig()['youtube_api_key'];
		return $this->youtube_key;
	}
	
	public function getChannelData($channel_id)
	{
		// Get the YouTube data if not set.
		$channel_url = 'https://www.googleapis.com/youtube/v3/channels?' .
			'part=snippet&' .
			'id=' . $channel_id . '&' .
			'key=' . $this->getYoutubeKey();
		return json_decode(file_get_contents($channel_url));
	}

	public function getEpisodeData($channel_id)
	{
				
		$episode_list = 'https://www.googleapis.com/youtube/v3/activities?' .
			'part=id%2C+snippet%2C+contentDetails&' .
			'channelId='. $channel_id . '&'.
			'maxResults=50&fields=items(contentDetails%2Csnippet)&' .
			'key=' .  $this->getYouTubeKey();
		return file_get_contents($episode_list);
	}

	public function setYoutubeFields($channelData, $test = false)
	{
	    // Return the first array item the channel information
		$channel = $channelData->items[0];
		
		$subscription = new SubscriptionEntity();
		$subscription->__set('title', $channel->snippet->title);
		$subscription->__set('description', $channel->snippet->description);
		$subscription->__set('src', $channel->id);
		$subscription->__set('url', $channel->id);
		$subscription->__set('download', false);
		$subscription->__set('type', 'youtube');
		$subscription->__set('create_date', new \DateTime('now'));
		$subscription->__set('modified_date', new \DateTime('now'));
		
		// Skip the image if running a test
		if($test)
		  return $subscription;
		
		// Use FILE SERVICE to transfer the image over
		$image = FileService::getSubscriptionCoverArt($channel->snippet->title, $channel->snippet->thumbnails->high->url);
		$subscription->__set('image', $image);		
	
		return $subscription;
	}
		
    public function search($keyword)
    {
        // Get the YouTube key from the Config File
        $key = $this->getYouTubeKey();
        
        $query_url = 'https://www.googleapis.com/youtube/v3/search?' .
            'part=snippet&' .
            'q=' . urlencode($keyword). '&' .
            'type=channel&' .
            'maxResults=50&'.
            'key=' . $key;
         
        $query = file_get_contents($query_url);
        $rsp = json_decode($query);
        
        $responseCollection = array();
        
        foreach ($rsp->items as $value) {
            $item = $value->snippet;
            $itemCollection['title'] = $item->title;
            $itemCollection['description'] = $item->description;
            $itemCollection['img'] = $item->thumbnails->medium->url;
            $itemCollection['channelId'] = $item->channelId;
            $responseCollection[] = $itemCollection;
        };
        
        return array(
            'success' => true,
            'results' => $responseCollection
        );        
        
    }

	
}

?>