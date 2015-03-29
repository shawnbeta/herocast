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

    private static function getFirstXML($rqst)
    {
        return self::getSimplePie($rqst);
    }

    private static function getSecondXML($first)
    {
        return self::getZetaAlt($first);
    }

    private static function getSimplePie($rqst)
    {
        $pieData = new \SimplePie();
        $pieData->set_feed_url($rqst['src']);
        self::$src = $rqst['src'];
        $pieData->init();
        $pieData->handle_content_type();

        /* return Subscription model */
        $rsp['subscription'] =  self::subscriptionBase($pieData);

        /* return Array of Episode models */
        $rsp['episodes'] =  self::episodeBase($pieData);
        return $rsp;
    }

    private static function getZetaAlt($data)
    {
        $data['subscription'] = self::zetaSubscriptionAlt($data['subscription']);
        $data['episodes'] = self::zetaEpisodeAlt($data['episodes']);
        return $data;
    }

    private static function subscriptionBase($pieData)
    {
        $subscription = new Subscription;
        $subscription->setTitle($pieData->get_title());
        $subscription->setDescription($pieData->get_description());
        $subscription->setHomePage($pieData->get_link());
        $subscription->setImage($pieData->get_image_url());
        return $subscription;
    }

    private static function episodeBase($pieData, $lu=false)
    {

        if(!$lu)
            $lu = new \DateTime('1877');

        $episode = new Episode();

        foreach ($pieData->get_items() as $item) {
            // Get an image if one exist
            $image =  self::getImage($item);
            $pubDateObj = new \DateTime($item->get_date());
            $pubDateInt = strtotime($pubDateObj->format('Y-m-d H:i:s')) * 1000;

            if($pubDateObj >  $lu){
                $episode->setTitle($item->get_title());
                $episode->setDescription($item->get_description());
                $episode->setSrc($item->get_enclosure()->get_link());
                $episode->setPubDate($pubDateInt);
                $episode->setImage($image);
                $episodeData[] = $episode;
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

    private static function getImage($parent)
    {
        if($image = $parent->get_enclosure()->get_thumbnail()){
            return $image;
        }
        // Try to see if there is an image in the html of the description
        $html = new \simple_html_dom();
        $html->load($parent->get_description());

        // Just get one image for now
        $images = $html->find('img');

        // Check to see if an image exist in the description
        if($images != null && $images[0]->src != null){

            $width = (int)$images[0]->width;
            // If it does exist make sure the size is larger then 20 px or ignore the file.
            if($width > 20)
                return  $images[0]->src;
        }
    }

    private static function getSRC($item)
    {
        if($src = $item->get_enclosure()->get_link())
            return $src;
        $zxml = self::getZetaXML();
    }

    public static function getFormattedXML($src)
    {
        return simplexml_load_file($src);
    }


}
