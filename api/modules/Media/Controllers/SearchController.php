<?php

namespace ShawnBeta\Media\Controllers;

use ShawnBeta\Media\Services\SearchService;

use ShawnBeta\App\Controllers\BaseController;


class SearchController extends BaseController {

	public static function getAction($get)
	{
		switch($get['action']){
			case 'all' :
				$rsp = array();
				if($get['itunes'] === 'true'){
					$rsp['all'] = array_merge($rsp, SearchService::formatItunes($get));
					//$rsp['itunes'] = SearchService::formatItunes($get);
				}
				if($get['youtube'] === 'true')
					$rsp['all'] = array_merge($rsp, SearchService::formatYoutube($get));
				
					//$rsp['youtube'] = SearchService::formatYoutube($get);
				//if(isset($rsp['youtube']) && isset($rsp['itunes']))
					//$rsp['all'] = array_merge($rsp['youtube'], $rsp['itunes']);
				break;

			case 'itunes-raw' :
				$rsp = SearchService::getItunesData($get);
				break;
			case 'youtube-raw' :
				$rsp = SearchService::getYoutubeData($get);
				break;
			case 'details' :
				$rsp = SearchService::getDetails($get);
				break;				
		}

		parent::jsonResponse($rsp);

	}

}
