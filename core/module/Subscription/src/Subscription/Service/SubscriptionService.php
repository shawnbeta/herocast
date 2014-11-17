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

use Application\Service\BaseService;
use Subscription\Entity\SubscriptionEntity;

class SubscriptionService extends BaseService{
    
    protected $subscription;

    // Return all subscriptions
    public function getAll()
    {
        $result = $this->om->getRepository('Subscription\Entity\SubscriptionEntity')->findAll();
        
        // Iterate over subs to make arrays
        foreach ($result as $s){
            $subscriptions[] = $s->getArrayCopy();
        }
        return array(
            'subscriptions' => $subscriptions,
            'success' => true,
        );        
    }

    public function getOneBy($type, $value)
    {
        return $this->om->getRepository('Subscription\Entity\SubscriptionEntity')
            ->findOneBy(array($type => $value));
    }
    
    public function set($src, $type)
    {

		// See if subscription already exist
		// by checking src uniqueness.
		$subscription = $this->getOneBy('src', $src);
        
        if(!$subscription){

            // Since were adding a new feed we use a
            // date from a time long, long ago.
            $lu = new \DateTime("0000-00-00T00:00:00Z");
            	
            // Initialize episode service.
            $es = new EpisodeService($this->om, $this->om);
            	
            if($type != 'youtube'){
        
                // Get current feed data
                $fs = new FeedService();
                 
                // Return feed data from default service.
                $fd = $fs->getFeedData($src);
                 
                // Create the object/fields for subscriptions
                $subscription = $fs->setFields($fd, $src, $type);
                 
                // Use the episode service method to iterate
                // through each episode to create an episode 
                // object for each and return an array of objs.
                $episodes = $es->iterateFeedEpisodes($fd, $lu, $subscription);
        
            }else{
                // Get current feed data
                $ys = new YoutubeService($this->sm, $this->om);
                 
                // Retrieve channel data from channel id
                $cd = $ys->getChannelData($src);
                 
                // Create the subscription object and set fields
                $subscription = $ys->setYoutubeFields($cd);
        
                // Get current episode information
                $ed = $ys->getEpisodeData($src);
        
                // Set the episode objects and fields.
                $episodes = $es->setYouTubeFields($ed, $lu, $subscription);
            }
            	
            // Save the subscriptions and episodes for
            // both feed and youtube subscriptions
            $this->save($subscription);
            $es->set($episodes);
        };
        
        return array(
            'msg' => 'New Podcast added!',
            'success' => true,
            'subscription' => $subscription
        );

    }
    
    public function save($subscription)
    {
        $this->om->persist($subscription);
        $this->om->flush();
        
        return $subscription;
    }
    
    public function delete($params)
    {
        $subscription = $this->getOneBy('id', $params['id']);
        $this->om->remove($subscription);
        $this->om->flush();
        
        // Return the updated subscriptions
        return $this->getAll();
    }
    
    public function download($params)
    {
        // Get the subscription
        $subscription = $this->getOneBy('id', $params['id']);
        
        // Update the subscription
        $subscription->__set('download', $params['option']);
        
        // Save changes
        $this->om->persist($subscription);
        $this->om->flush();
        
        return array('success' => true);
    }

    
    public function getDummy()
    {
        
        $date = new \DateTime("now");
    
        // Create a phony Subscription entity
        $subscription1 = new SubscriptionEntity();
        $subscription1->title = 'RUNNING_TEST';
        $subscription1->description = "This is a test subscription to made to mock a true entity";
        $subscription1->src = "http://shawnbeta.com";
        $subscription1->url = "http://frizzmop.com/img/molly.png";
        $subscription1->type = "This is a test subscription to made to mock a true entity";
        $subscription1->download = false;
        $subscription1->create_date = $date;
        $subscription1->modified_date = $date;
        
        return $subscription1;
    
    
    }
    
    public function getDummies()
    {
        $date = new \DateTime("now");
    
        // Create a phony Subscription entity
        $subscription1 = new SubscriptionEntity();
        
        $subscription1->__set('title','RUNNING_TEST');
        $subscription1->__set('description', "This is a test subscription to made to mock a true entity");
        $subscription1->__set('src', "http://shawnbeta.com");
        $subscription1->__set('url', "http://frizzmop.com/img/molly.png");
        $subscription1->__set('download', false);
        $subscription1->__set('type', 'test');
        $subscription1->__set('create_date', $date);
        $subscription1->__set('modified_date', $date);
    
        $subscription2 = new SubscriptionEntity();
        $subscription2->__set('title','RUNNING_TEST');
        $subscription2->__set('description', "This is another test.");
        $subscription2->__set('src', "http://shawnbeta.com");
        $subscription2->__set('url', "http://frizzmop.com/img/molly.png");
        $subscription2->__set('download', false);
        $subscription2->__set('type', 'test');
        $subscription2->__set('create_date', $date);
        $subscription2->__set('modified_date', $date);
    
        return array($subscription1, $subscription2);
    }
    

    
}

?>
