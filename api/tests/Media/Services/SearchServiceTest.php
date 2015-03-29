<?php

namespace Media\Services;

use ShawnBeta\App\Services\BaseService;
use ShawnBeta\Utility\Services\FileService;

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
				'key=' . YOUTUBE_KEY);
	}

	public static function queryItunes($g)
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

	public static function queryYoutube($g)
	{
		$query = self::getYoutubeData($g);
		$data = json_decode($query);

		$rsp = array();

		foreach ($data->items as $value) {
			$item = $value->snippet;
			$series['title'] = $item->title;
			$series['description'] = $item->description;
			$series['img'] = $item->thumbnails->medium->url;
			$series['channelId'] = $item->channelId;
			array_push($rsp, $series);
		};

		return $rsp;


	}


}
