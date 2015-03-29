<?php

namespace ShawnBeta\Media\Services;

use ShawnBeta\Utility\Services\FileService;
use ShawnBeta\Utility\Services\UtilityService;
use ShawnBeta\App\Services\BaseService;
use ShawnBeta\Media\Services\EpisodeService;

class SubscriptionService extends BaseService{

    public static function addSubscription($g)
    {
        if(empty($g['src']))
            return print 'You need to enter a URL';

        if(filter_var($g['src'], FILTER_VALIDATE_URL)){
            $feedData = FeedParser::getFeedData($g);
            $subscription = self::makeFeedSubscription($feedData['subscription'], $g, $em);
            $subscription = EpisodeService::makeEpisodes($feedData['episodes'], $subscription, $em);

            var_dump($subscription->getEpisodes());

            $em->persist($subscription);
            $em->flush();
        }else{
            $ys = new YoutubeService();
            $channelData = $ys->getChannelData($g['src']);
            $episodeData = $ys->getEpisodeData($g['src']);
            if(isset($p['srcRSP']))
                return array($channelData, $episodeData);
            $subscription = SubscriptionService::makeYoutubeSubscription($channelData);
            EpisodeService::makeEpisodes($episodeData, $subscription);
        }
        if($subscription->getTitle() !== null){
            return array(
                'msg' => "Added new subscription " . $subscription->getTitle(),
                'subscription' => (array) $subscription
            );
        }

        return array(
            'msg' => "Something went wrong"
        );
    }

    public static function getSubscriptionsDateBefore($g)
    {
    	$query = self::getEM()
    		->createQuery('SELECT s FROM modules\media\models\Subscription s WHERE s.modifiedDate < :date');
    	$query->setParameter('date', $g['date']);
    	$subscriptions = self::buildArray($query->getResult());

    	return array(
    			'msg' => "Subscriptions BEFORE DATE",
    			'subscription' =>  (array) $subscriptions
    	);
    }

    public static function getSubscriptionsDateAfter($g)
    {
    	$query = self::getEM()
    	->createQuery('SELECT s FROM modules\media\models\Subscription s WHERE s.modifiedDate > :date');
    	$query->setParameter('date', $g['date']);
    	$subscriptions = parent::buildArray($query->getResult());

    	return array(
    			'msg' => "Subscriptions AFTER DATE",
    			'subscription' =>  (array) $subscriptions
    	);
    }

    public static function updateSubscription($g)
    {

    	$subscription = self::getEM()
    	->getRepository('modules\media\models\Subscription')
    	->find($g['id']);

    	$subscription->setAutoDownload($g['val']);

    	return array(
    			'msg' => "Here is the subscription",
    			'subscription' =>  (array) $subscription
    	);

    }

    public static function getFormattedXML($g)
    {
        return FeedParser::getFormattedXML($g['src']);
    }

    public static function getAllSubscriptions()
    {

        $subscriptions = self::getEM()
            ->getRepository('modules\media\models\Subscription')
            ->findAll();



        return array(
            'msg' => "Here are the subscriptions",
            'subscription' =>  $subscriptionArray
        );
    }

    public static function getSubscriptionByID($g)
    {
        $subscription = self::getEM()
            ->getRepository('modules\media\models\Subscription')
            ->find($g['id']);

        return array(
            'msg' => "Here is the subscription",
            'subscription' =>  (array) $subscription
        );

    }

    public static function makeFeedSubscription($subscription, $g, $em)
    {

        // Add the rest of the values
        // Make a copy of the subscription cover art on the server.
        //$subscription->setTitle($subscriptionData['title']);
        $subscription->setMachineName(UtilityService::machinify($subscription->getTitle()));
        $subscription->setSrc($g['src']);
        $subscription->setImage(FileService::copyToServer($subscription->getImage(),
            'cover-art', $subscription->getMachineName()));
        $subscription->setSubscriptionType($g['subscriptionType']);
        $subscription->setAutoDownload(0);
        $date = round(microtime(true) * 1000);

        $subscription->setCreateDate($date);
        $subscription->setModifiedDate($date);

        //return $subscription;

        $em->persist($subscription);
        $em->flush();
        $em->clear();
        $em->detach($subscription);
        return $subscription;
        //return $em->getReference('modules\media\models\Subscription', $subscription->getId());

    }

		public static function deleteSubscription($g)
		{
			$em = self::getEM();
			$subscription = $em
			->getRepository('modules\media\models\Subscription')
			->find($g['id']);

			$em->remove($subscription);
			$em->flush();

			// Verify deletion worked by trying to query again
			$subscription = $em
			->getRepository('modules\media\models\Subscription')
			->find($g['id']);

			if($subscription)
				return array('msg' => 'Something went wrong. The subscription still exist.');

			return array('msg' => 'Subscription Deleted.');

		}




}
