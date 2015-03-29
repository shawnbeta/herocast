<?php

namespace Media\Controllers;

use modules\media\services\SearchService;
use modules\app\controllers\BaseController;


class SearchController extends BaseController {

	public static function getAction($get)
	{

		switch($get['action']){
			case 'all' :
				if($get['itunes'] === 'true')
					$rsp['itunes'] = SearchService::queryItunes($get);
				if($get['youtube'] === 'true')
					$rsp['youtube'] = SearchService::queryYoutube($get);
				break;

			case 'itunes-raw' :
				$rsp = SearchService::getItunesData($get);
				break;
			case 'youtube-raw' :
				$rsp = SearchService::getYoutubeData($get);
				break;
		}

		parent::jsonResponse($rsp);

	}

}
