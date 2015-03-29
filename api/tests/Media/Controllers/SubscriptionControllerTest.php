<?php
namespace ShawnBeta\Media\Controllers;

use ShawnBeta\Media\Services\SubscriptionService;
use ShawnBeta\App\Controllers\BaseController;

class SubscriptionController extends BaseController {

    public static function getAction($get)
    {

        switch($get['action']){

	        	case 'search' :
	        		if($get['itunes']){
	        			$rsp['itunes'] = SubscriptionService::searchItunes($get);
	        		}
	        		if($get['youtube']){
	        			$rsp['itunes'] = SubscriptionService::searchYoutube($get);
	        		}

	        		$rsp = SubscriptionService::searchSubscription($get);
	        		break;
            case 'add' :
              $rsp = SubscriptionService::addSubscription($get);
              break;
            case 'get':
            	if($get['id'] == 'all'){
            		$rsp = SubscriptionService::getAllSubscriptions();
            	}else if($get['id'] == 'many-date-before'){
            		$rsp = SubscriptionService::getSubscriptionsDateBefore($get);
            	}else if($get['id'] == 'many-date-after'){
            		$rsp = SubscriptionService::getSubscriptionsDateAfter($get);
            	}else{
            		$rsp = SubscriptionService::getAllSubscriptions($get);
            	}
              break;
              case 'update' :
              	$rsp = SubscriptionService::updateSubscription($get);
              	break;
            	case 'delete' :
             		$rsp = SubscriptionService::deleteSubscription($get);
              	break;

        }
        parent::jsonResponse($rsp);

    }

}
