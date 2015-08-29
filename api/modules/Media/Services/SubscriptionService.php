<?php
namespace ShawnBeta\Media\Services;

use ShawnBeta\App\Services\BaseService;
use ShawnBeta\Media\Services\EpisodeService;
use ShawnBeta\Media\PDO\SubscriptionPDO;
use ShawnBeta\Media\PDO\EpisodePDO;
use ShawnBeta\Utility\Services\FileService;
use ShawnBeta\Utility\Services\UtilityService;
use ShawnBeta\Media\Models\Subscription;

class SubscriptionService extends BaseService {

	public static function addSubscription($g) {
		if (empty ( $g ['src'] ))
			return print 'You need to enter a URL';
		
		if (filter_var ( $g ['src'], FILTER_VALIDATE_URL )) {
			$lastUpdate = new \DateTime ( '1899' );
			$g['lu'] = strtotime($lastUpdate->format('Y-m-d H:i:s'));			
			$feedData = FeedParser::getFeedData ( $g );
			$subscription = self::makeFeedSubscription ( $feedData['subscription'], $g );
			EpisodeService::makeEpisodes ( $feedData['episodes'], $subscription );
		} else {
			$subscription = new Subscription;
			$subscriptionBase = YoutubeService::getSubscriptionData($subscription, $g);
			$episodeBase = YoutubeService::getEpisodeData ($g);
			
			$subscription = self::makeYoutubeSubscription ( $subscriptionBase, $g );
			EpisodeService::makeEpisodes ( $episodeBase, $subscription );
		}
		if ($subscription->getTitle () !== null) {
			return array (
					'msg' => "Added new subscription " . $subscription->getTitle (),
					'subscription' => $subscription->getArray(),
					'episodes' => EpisodeService::getEpisodesBySubscription($subscription->getId())
			);
		}
		
		return array (
				'msg' => "Something went wrong" 
		);
	}
	
	public static function getAll()
	{
		return SubscriptionPDO::fetchAllSubscriptions();
	}
	
	public static function getRaw($g)
	{
		if (filter_var ( $g ['src'], FILTER_VALIDATE_URL )) {
			var_dump(FeedParser::getFormattedXML($g));
		}else{
			var_dump(YoutubeService::queryChannelData($g));
			var_dump(YoutubeService::queryEpisodeData($g));
		}
	}
	
	public static function getSubscriptionsDateBefore($g) {

		$subscriptions = SubscriptionPDO::fetchSubscriptionsModifiedBefore($g['last-update']);
		
		return array (
				'msg' => "Subscriptions BEFORE DATE",
				'subscription' => $subscriptions 
		);
	}
	
	public static function getSubscriptionsDateAfter($g) {
		return SubscriptionPDO::fetchSubscriptionAndEpisodesByPubDate($g['last-update']);

	}
	
	public static function getSubcriptionById($id)
	{
		return SubscriptionPDO::fetchSubscription($id);
	}
	
	public static function loadModel($id){
		
		// Get the array from database
		$data = SubscriptionPDO::fetchSubscription($id);
		// Load the subscription object
		$sc = new Subscription();
		$subscription = $sc->getModel($data);
		return $subscription;
	}
	
	public static function updateAutoDownload($g) {
		// Doing multiple queries to make sure data is correct.
		$oldSubscription = SubscriptionPDO::fetchSubscription($g['id']);
		SubscriptionPDO::updateAutoDownload($g);
		// Verify changes
		$updatedSubscription = SubscriptionPDO::fetchSubscription($g['id']);
		
		return array (
				'msg' => "Result of Auto Download update",
				'old_value' => $oldSubscription['auto_download'],
				'sent_value' => $g['val'],
				'new_value' => $updatedSubscription['auto_download'],
				'success' => $updatedSubscription['auto_download'] === $g['val']
		);
	}
	
	
	public static function getFormattedXML($g) {
		return FeedParser::getFormattedXML ( $g ['src'] );
	}
	public static function getAllSubscriptions() {
		
		$subscriptionArray = SubscriptionPDO::fetchAllSubscriptions();
		
		return array (
				'msg' => "Here are the subscriptions",
				'subscriptions' => $subscriptionArray 
		);
	}

	public static function makeFeedSubscription($subscription, $g) {
		// Add the rest of the values
		// Make a copy of the subscription cover art on the server.
		// $subscription->setTitle($subscriptionData['title']);
		$subscription->setMachineName ( UtilityService::machinify ( $subscription->getTitle () ) );
		$subscription->setSrc ( $g['src'] );
		$subscription->setImage ( FileService::copyToServer ( $subscription->getImage(), 'cover-art', $subscription->getMachineName()) );
		$subscription->setSubscriptionType ( $g['subscriptionType'] );
		$subscription->setAutoDownload ( 0 );
		//$date = round ( microtime ( true ) * 1000 );
		
		$date = new \DateTime();
		$dateInt = strtotime($date->format('Y-m-d H:i:s'));
		
		$subscription->setCreateDate ( $dateInt );
		$subscription->setModifiedDate ( $dateInt );
		
		$subscriptionId = SubscriptionPDO::persistSubscription($subscription);
		$subscription->setId($subscriptionId);
		return $subscription;
	}
	
	public static function makeYoutubeSubscription($subscription, $g) {
		// Add the rest of the values
		// Make a copy of the subscription cover art on the server.
		$subscription->setMachineName ( UtilityService::machinify ( $subscription->getTitle () ) );
		$subscription->setSrc ( $g['src'] );
		$subscription->setImage ( FileService::copyToServer ( $subscription->getImage(), 'cover-art', $subscription->getMachineName()) );
		$subscription->setSubscriptionType ( 'youtube' );
		$subscription->setAutoDownload ( 0 );
	
		$date = new \DateTime();
		$dateInt = strtotime($date->format('Y-m-d H:i:s'));
	
		$subscription->setCreateDate ( $dateInt );
		$subscription->setModifiedDate ( $dateInt );
	
		$subscriptionId = SubscriptionPDO::persistSubscription($subscription);
		$subscription->setId($subscriptionId);
		return $subscription;
	}	
	
	
	public static function deleteSubscription($g) {
		SubscriptionPDO::removeSubscription($g['id']);
		EpisodePDO::removeEpisodes($g['id']);
	}
	
	
	public static function deleteAll()
	{
		SubscriptionPDO::deleteAll();
	}
	
	public static function getNewEpisodes($g) 
	{
		// Start by gathering all subscriptions
		$subscripitons = SubscriptionPDO::fetchSubscriptionsWithLatestEpisode();
		// Iterate over each subscription.
		foreach ($subscripitons as $subscripiton){
			$rqst['lu'] = $subscripiton['pub_date'];
			$sc = new Subscription();
			$subscripiton = $sc->getModel($subscripiton);
			$rqst['src']  = $subscripiton->getSrc();
			$rsp = FeedParser::getNewEpisodes($rqst);
			EpisodeService::makeEpisodes ( $rsp['episodes'], $subscripiton );
		}
		return self::getSubscriptionsDateAfter($g);
		
	}
	
}
