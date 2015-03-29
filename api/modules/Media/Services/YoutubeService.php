<?php
namespace ShawnBeta\Media\Services;

use ShawnBeta\App\Services\BaseService;
use ShawnBeta\Media\Models\Episode;
use ShawnBeta\Utility\Services\FileService;

class YoutubeService extends BaseService {
	
	protected static $youtubeKey;
	
	public static function getYoutubeKey()
	{
		if(self::$youtubeKey === null)
			self::$youtubeKey = self::getSettings()['parameters']['apis']['youtube'];
		return self::$youtubeKey;
	}

	public static function getSubscriptionData($subscription, $g)
	{
		$channelData = self::queryChannelData($g);
		return self::subscriptionBase($subscription, json_decode($channelData));
	}
	
	public static function getEpisodeData($g, $count = 50)
	{
		$episodeData = self::queryEpisodeData($g, $count);
		return self::episodeBase(json_decode($episodeData));
	}
	
	public static function queryChannelData($g)
	{
		return file_get_contents( 'https://www.googleapis.com/youtube/v3/channels?' .
				'part=snippet&' .
				'id=' . $g['src'] . '&' .
				'key=' . self::getYoutubeKey());		
	}
	
	public static function queryEpisodeData($g, $count)
	{
		return file_get_contents( 'https://www.googleapis.com/youtube/v3/activities?' .
				'part=id%2C+snippet%2C+contentDetails&' .
				'channelId='. $g['src'] . '&'.
				'maxResults='. $count. '&fields=items(contentDetails%2Csnippet)&' .
				'key=' .  self::getYoutubeKey());
	}
	
	private static function subscriptionBase($subscription, $data)
	{
		$item = $data->items[0]->snippet;
		$subscription->setTitle($item->title);
		$subscription->setDescription($item->description);
		$subscription->setHomePage($data->items[0]->id);
		$subscription->setImage($item->thumbnails->high->url);
		return $subscription;
	}
	
	private static function episodeBase($data, $lu=false)
	{
	
		$episodeData = array();
	
		foreach ($data->items as $item) {
			
			$snippet = $item->snippet;
				
			$pubDateObj = new \DateTime($snippet->publishedAt);
			$pubDateInt = strtotime($pubDateObj->format('Y-m-d H:i:s')) * 1000;;
						
			if(isset($snippet->title) && isset($pubDateInt)
					&& $pubDateInt > $lu
					&& isset($item->contentDetails->upload->videoId)){
				//print 'true';
				$episode = new Episode();
				// Get an image if one exist
					$episode->setTitle($snippet->title);
					$episode->setDescription($snippet->description);
					$episode->setSrc($item->contentDetails->upload->videoId);
					$episode->setPubDate($pubDateInt);
					if(isset($snippet->thumbnails->standard))
						$episode->setImage($snippet->thumbnails->standard->url);
					array_push($episodeData, $episode);
			}
		}
		return $episodeData;
	}
	

	public static function getSearchDetailEpisodes($g)
	{
		$data = json_decode(self::queryEpisodeData($g, 5));
		$episodeCollection = array();
				foreach ($data->items as $item) {
					$snippet = $item->snippet;
					$pubDateObj = new \DateTime($snippet->publishedAt);
					$pubDateInt = strtotime($snippet->publishedAt) * 1000;
					//$pubDateInt = strtotime($pubDateObj->format('Y-m-d H:i:s'));
					$episode['title'] = $snippet->title;
					$episode['description'] = $snippet->description;
					$episode['pub_date'] = $pubDateInt;
					array_push($episodeCollection, $episode);
				}
				$rsp['episodes'] = $episodeCollection;
				return $rsp;
	}
	
	
}