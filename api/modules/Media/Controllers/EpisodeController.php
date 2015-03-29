<?php
namespace ShawnBeta\Media\Controllers;

use ShawnBeta\Media\Services\EpisodeService;
use ShawnBeta\App\Controllers\BaseController;
use ShawnBeta\Utility\Services\FileService;

class EpisodeController extends BaseController {

	public static function getAction($get)
	{

		switch($get['action']){

			case 'add' :
				$rsp = EpisodeService::addSubscription($get);
				break;
			case 'get':
					if($get['id'] == 'all'){
						$rsp = EpisodeService::getAllEpisodes();
					}else if($get['id'] == 'many-date-before'){
						$rsp = EpisodeService::getEpisodesDateBefore($get);
					}else if($get['id'] == 'many-date-after'){
						$rsp = EpisodeService::getEpisodesDateAfter($get);
					}else{
						$rsp = EpisodeService::getEpisodeByID($get);
					}
				break;
			case 'copy' :
				$rsp = EpisodeService::copyEpisode($get);
				break;
			case 'update' :
				switch ($get['field']) {
					case 'watched' :
						$rsp = EpisodeService::setWatched($get);
						break;
					case 'bookmark' :
						$rsp = EpisodeService::setBookmark($get);
				}
				
				
				break;
		}
		parent::jsonResponse($rsp);

	}




}
