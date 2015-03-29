<?php

namespace ShawnBeta\App\Controllers;

use ShawnBeta\App\Services\AppService;
use ShawnBeta\Media\Services\SubscriptionService;

class AppController extends BaseController {

    public static function getAction($get)
    {

        switch($get['action']){
        	case 'bulk' :
        		$rsp = AppService::getBulkMedia($get);
        		break;
        	case 'test' :
              $rsp = AppService::testConnection($get);
              break;
              case 'purge' :
              	$rsp = AppService::purgeMedia();
              	break;              
              
            case 'get-modified' :
              $rsp = AppService::getModified($get);
              break;          
						case 'departures' :
            	$rsp = AppService::processDepartures($get);
             	break;
						case 'get-new-episodes' :
							$rsp = SubscriptionService::getNewEpisodes($get);              
        }
        parent::jsonResponse($rsp);

    }
}
