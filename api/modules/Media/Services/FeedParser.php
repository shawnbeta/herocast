<?php
/**
 * Created by PhpStorm.
 * User: shawn
 * Date: 2/9/15
 * Time: 5:51 PM
 */

namespace ShawnBeta\Media\Services;

use ShawnBeta\Media\Models\Subscription;
use ShawnBeta\Media\Models\Episode;
use ShawnBeta\Utility\Services\FileService;

class FeedParser {

    private static $zetaXML;
    private static $src;
    private  static function getZetaXML(){
        if(self::$zetaXML === null){
            self::$zetaXML = \ezcFeed::parse(self::$src);
        }
        return self::$zetaXML;
    }

    public static function getFeedData($rqst)
    {
        $firstRsp = self::getFirstXML($rqst);
        $rsp = self::getSecondXML($firstRsp);
        return $rsp;
    }

    public static function getNewEpisodes($rqst)
    {
    	
    	$pieData = self::getSimplePie($rqst);
    	$rsp['episodes'] =  self::pieEpisodeBase($pieData, $rqst['lu']);
    	return self::getZetaAlt($rsp);
    	
    }
    
    private static function getFirstXML($rqst)
    {
    		$pieData = self::getSimplePie($rqst);
    		
    		/* return Subscription model */
    		$rsp['subscription'] =  self::pieSubscriptionBase($pieData);
    		
    		/* return Array of Episode models */
    		$rsp['episodes'] =  self::pieEpisodeBase($pieData, $rqst['lu']);
    		
        return $rsp;
    }

    private static function getSecondXML($first)
    {
        return self::getZetaAlt($first);
    }

    public static function getSimplePie($rqst)
    {
        $pieData = new \SimplePie();
        $pieData->set_feed_url($rqst['src']);
        self::$src = $rqst['src'];
        $pieData->init();
        $pieData->handle_content_type();
        return $pieData;
    }

    private static function getZetaAlt($data)
    {
    	if(isset($data['subscription']))
        $data['subscription'] = self::zetaSubscriptionAlt($data['subscription']);
    	if(isset($data['episodes']))
        $data['episodes'] = self::zetaEpisodeAlt($data['episodes']);
        return $data;
    }

    private static function pieSubscriptionBase($pieData)
    {
        $subscription = new Subscription;
        $subscription->setTitle($pieData->get_title());
        $subscription->setDescription($pieData->get_description());
        $subscription->setHomePage($pieData->get_link(0));
        $subscription->setImage($pieData->get_image_url());
        return $subscription;
    }

    private static function zetaSubscriptionBase($zetaData)
    {
    	$subscription = new Subscription;
    	$subscription->setTitle($zetaData->title);
    	$subscription->setDescription($zetaData->description);
    	$subscription->setHomePage($zetaData->link);
    	$subscription->setImage($zetaData->image);
    	return $subscription;
    }
    
    //private static function pieEpisodeBase($pieData, $lu=false)
    private static function pieEpisodeBase($pieData, $lu)
    {

        $episodeData = array();

        foreach ($pieData->get_items() as $item) {
        	$episode = new Episode();
            // Get an image if one exist
            $image =  FileService::getImage($item);
            $pubDateObj = new \DateTime($item->get_date());
            //var_dump($pubDateObj);
            //$pubDateInt = strtotime($pubDateObj->format('Y-m-d H:i:s'));
            $pubDateInt = strtotime($item->get_date()) * 1000;
            //var_dump($item->get_date());
            //var_dump($pubDateInt);  
						
            $durationArray = $item->get_item_tags('http://www.itunes.com/dtds/podcast-1.0.dtd', 'duration');
            $duration = $durationArray[0]['data'];
            
            //echo $duration;

//            echo 'pub int';
//            echo $pubDateInt;
//            echo 'lu';
//            echo $lu;
            
            if($pubDateInt > $lu){
                $episode->setTitle($item->get_title());
                $episode->setDescription($item->get_description());
                $episode->setSrc($item->get_enclosure()->get_link());
                $episode->setPubDate($pubDateInt);
                $episode->setImage($image);
                $episode->setDuration($duration);
								array_push($episodeData, $episode);
            }
        }
        
        return $episodeData;
    }

    private static function zetaEpisodeBase($zetaData, $lu=false)
    {
    
    	//if(!$lu)
    	// $lu = new \DateTime('1877');
    
    
    	$episodeData = array();
    
    	foreach ($zetaData->item as $item) {
    		$episode = new Episode();
    		// Get an image if one exist
    		$image =  self::getImage($item);
    		$pubDateObj = new \DateTime($item->published->date);
    		$pubDateInt = strtotime($pubDateObj->format('Y-m-d H:i:s'));
    		if($pubDateObj >  $lu){
    			$episode->setTitle($item->title);
    			$episode->setDescription($item->description);
    			$episode->setSrc($item->enclosure[0]->url);
    			$episode->setPubDate($pubDateInt);
    			$episode->setImage($image);
    			array_push($episodeData, $episode);
    		}
    	}
    	return $episodeData;
    }
    
    
    private static function zetaSubscriptionAlt($subscription)
    {
        $feed = self::getZetaXML();
        if($subscription->getTitle() === null)
            $subscription->setTitle($feed->title);
        if($subscription->getDescription() === null)
            $subscription->setDescription($feed->description);
        if($subscription->getSrc() === null)
            $subscription->setSrc($feed->link);
        if($subscription->getImage() === null)
            $subscription->setImage($feed->image);
        return $subscription;
    }

    private static function zetaEpisodeAlt($episodes)
    {
        $zxml = self::getZetaXML();
        $items = $zxml->item;
        $i=0;

        $episode = new Episode();
        foreach ($episodes as $item){
            // if there are no empty fields
            // skip it.
            if(property_exists($episode, null)){
                continue;
            }
            //var_dump($episode);

            if($episode->getTitle() === null)
                $episode->setTitle($items[$i]->title);
            if($episode->getDescription() === null)
                $episode->setDescription($items[$i]->description);
            if($episode->getPubDate() === null){
              $pubDateObj = $items[$i]->published->date;
              $pubDateInt = strtotime($pubDateObj->format('Y-m-d H:i:s')) * 1000;
              $episode->setPubDate($pubDateInt);
            }

            if($episode->getSrc() === null)
                $episode->setSrc($items[$i]->enclosure[0]->url);
            $i++;
        }
        return $episodes;
    }

    private static function getSRC($item)
    {
        if($src = $item->get_enclosure()->get_link())
            return $src;
        $zxml = self::getZetaXML();
    }

    public static function getFormattedXML($g)
    {
        return simplexml_load_file($g['src']);
    }
    
    public static function getSearchDetails($g)
    {
    	$pieData = self::getSimplePie($g);
    	$rsp['description'] = self::fetchSearchDetailsDescription($g, $pieData);
    	$rsp['episodes'] =  self::fetchSearchDetailsEpisodes($g, $pieData);
    	return $rsp;
    }
    
    public static function fetchSearchDetailsDescription($g, $pieData)
    {
    	$description = $pieData->get_description();
    	if($description === null){
    		$feed = self::getZetaXML();
    		$description = $feed->description;
    	}
    	return $description;
    }
    
    public static function fetchSearchDetailsEpisodes($q, $pieData)
    {
    	$episodeCollection = array();
    	foreach ($pieData->get_items() as $item) {
    		$episode['title'] = $item->get_title();
    		$episode['description'] = $item->get_description();
    		$pubDateObj = new \DateTime($item->get_date());
    		
    		$pubDateInt = strtotime($item->get_date()) * 1000;
    		//$pubDateInt = strtotime($pubDateObj->format('Y-m-d H:i:s'));
				$episode['pub_date'] = $pubDateInt; 
				array_push($episodeCollection, $episode);   		
    	}
    	return $episodeCollection;
    }

}
