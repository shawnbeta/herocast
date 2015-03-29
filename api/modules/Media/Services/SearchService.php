<?php

namespace ShawnBeta\Media\Services;

use ShawnBeta\App\Services\BaseService;
use ShawnBeta\Utility\Services\FileService;
use ShawnBeta\Media\Services\YoutubeService;
use ShawnBeta\Media\Services\FeedParser;


class SearchService extends BaseService {

	public static function getItunesData($g)
	{
		return file_get_contents('https://itunes.apple.com/search?media=podcast&term='
				. urlencode($g['keyword']));
	}

	public static function getYoutubeData($g) {
		return file_get_contents( 'https://www.googleapis.com/youtube/v3/search?' .
				'part=snippet&' .
				'q=' . urlencode($g['keyword']) . '&' .
				'type=channel&' .
				'maxResults=50&' .
				'key=' . YoutubeService::getYoutubeKey());
	}

	public static function formatItunes($g)
	{
		$url = self::getItunesData($g);
		$data = json_decode($url);

		$rsp = array();

		foreach ($data->results as $item) {
			$series['title'] = $item->trackName;
			$series['src'] = $item->feedUrl;
			$series['img'] = $item->artworkUrl100;
			array_push($rsp, $series);
		};

		return $rsp;
	}

	public static function formatYoutube($g)
	{
		$query = self::getYoutubeData($g);
		$data = json_decode($query);

		$rsp = array();

		foreach ($data->items as $value) {
			$item = $value->snippet;
			$series['title'] = $item->title;
			/*
			 * Send the description so only the episode
			 * data needs to be queried if the user wants
			 * additional detail. UX layer will know how to 
			 * handle the description field we won't worry 
			 * about that here. 
			*/
			$series['description'] = $item->description;
			$series['img'] = $item->thumbnails->medium->url;
			$series['src'] = $item->channelId;
			array_push($rsp, $series);
		};
		return $rsp;
	}

	public static function getDetails($g)
	{
		/*
		 * Returns description from Search Items
		 * RSS Feed. No description needed for 
		 * Youtube. Queries episodes so user gets
		 * an idea of upload frequency.
		 */
		
		/*
		 * NOTE: $q will need to contain a field
		 * for description 'd'(youtube) or not.
		 */

		if(filter_var ( $g ['src'], FILTER_VALIDATE_URL )){
			return FeedParser::getSearchDetails($g);
		}else{
			return YoutubeService::getSearchDetailEpisodes($g);
		}
		
		
		
	}
	
	
}
