<?php
namespace ShawnBeta\App\Services;

use ShawnBeta\Media\Services\SubscriptionService;
use ShawnBeta\Media\Services\EpisodeService;

class AppService extends BaseService {
	
	public static function testConnection($g) {
		return array (
				'success' => true
		);
	}
	
	public static function processDepartures($g) {
		$step1 = html_entity_decode($g['val']);
		$data = json_decode($step1);
		foreach ($data as $item){
			$ticket = (array)json_decode($item);
			switch ($ticket['entity']){
				case 'episode':
					switch ($ticket['field']){
						case 'watched':
								EpisodeService::setWatched($ticket);
						break;
						case 'bookmark':
							EpisodeService::setBookmark($ticket);
					}
					break;
				case 'subscription':
					switch ($ticket['action']){
						case 'update':
							SubscriptionService::setAutoDownload($g);
							break;
						case 'delete':
							SubscriptionService::removeSubscriptions($g);
					}
					break;					
					
					}

					
					
					
			}
			
			return array('success' => true);
		}
	
	
	public static function getBulkMedia()
	{
		$rsp['subscriptions'] = SubscriptionService::getAll();
		$rsp['episodes'] = EpisodeService::getAll();
		return $rsp;
	}
	
	public static function getModified($g)
	
	{
		SubscriptionService::getNewEpisodes($g);
		$rsp['subscriptions'] = getSubscriptionsDateAfter($g);
		$rsp['episodes'] = getEpisodesDateAfter($g);
		return $rsp;
	}
	
	public static function purgeMedia()
	{
		$originalSubscriptionCount = count(SubscriptionService::getAll());
		$originalEpisodeCount = count(EpisodeService::getAll());
		
		SubscriptionService::deleteAll();
		EpisodeService::deleteAll();
		
		$newSubscriptionCount = count(SubscriptionService::getAll());
		$newEpisodeCount = count(EpisodeService::getAll());
		
		return array (
				'msg' => "Response for purging all Subscriptions and Episodes",
				'old_value: subscriptions' => $originalSubscriptionCount,
				'old_value: episodes' => $originalEpisodeCount,
				'new_value: subscriptions' => $newSubscriptionCount,
				'new_value: episodes' => $newEpisodeCount,				
				'success' => $newEpisodeCount === 0 && $newSubscriptionCount == 0
		);
		
	}
	
}
