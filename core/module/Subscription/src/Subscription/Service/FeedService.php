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

// Zend Stuff
use Zend\Feed\Reader\Reader;

// Third Party
use SimplePie;

// Custom Stuff
use Subscription\Entity\SubscriptionEntity;
use Utility\Service\FileService;


class FeedService {
	
	protected $subscription;
	
	protected $pieData;
	
	// Using Zend\Feed\Reader whenever SimplePie
	// fails and leaves empty fields.
	private $zendData;
	
	public function getZendData($src)
	{
		if($this->zendData === null){
			$this->zendData = Reader::import($src);
		}
		return $this->zendData;
	}

	public function getSPData($src)
	{
		if($this->pieData === null)
			$this->pieData = $this->fetchSimplePie($src);
		return $this->pieData;
	}
	
	// Parse the feed with SimplePie
	public function fetchSimplePie($src)
	{	
		$pieData = new \SimplePie();
		$pieData->set_feed_url($src);
		$pieData->init();
		$pieData->handle_content_type();	
		return $pieData;
	}	
			
	public function setFields($fd, $src, $type)
	{
		$subscription = new SubscriptionEntity();
		
		// Add the data from Reader import to the subscription object
		$subscription->__set('title', $fd->get_title());
		$subscription->__set('description', $fd->get_description());
		$subscription->__set('src', $src);
		$subscription->__set('url', $fd->get_link());
		$subscription->__set('download', false);
		$subscription->__set('type', $type);		
		$subscription->__set('create_date', new \DateTime("now"));
		$subscription->__set('modified_date', new \DateTime("now"));
		
		// Run the subscription through the fallback
		// to attempt to fill empty field values.
		$subscription = $this->subscriptionFallback($subscription);
		
		// If the type is set to test don't worry about the image
		//if($type === 'test')
		    //return $subscription;

		// Use FILE SERVICE to transfer the image over
		$image = FileService::getSubscriptionCoverArt($fd->get_title(), $fd->get_image_url());
		$subscription->__set('image', $image);
		return $subscription;
	}

	public function subscriptionFallback($subscription)
	{
		// Use Zend Feed reader to fill in the blanks simple pie may leave.
		if($subscription->__get('title') === null)
			$subscription->__set('title', $this->getZendData($subscription->__get('src'))-> getTitle());
		if($subscription->__get('description') === null)
			$subscription->__set('description', $this->getZendData($subscription->__get('src'))-> getDescription());
		if($subscription->__get('url') === null)
			$subscription->__set('url', $this->getZendData($subscription->__get('src'))-> getLink());		
		return $subscription;
	}
		
	public function getFeedData($src)
	{
		// Simply return current feed data
		// using SimplePie for the default parser.
	    return $this->getSPData($src);

	}
}

?>