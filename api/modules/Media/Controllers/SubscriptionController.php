<?php
namespace ShawnBeta\Media\Controllers;

use ShawnBeta\Media\Services\SubscriptionService;
use ShawnBeta\App\Controllers\BaseController;

class SubscriptionController extends BaseController {

    public static function getAction($get)
    {

        switch($get['action']){

            case 'add' :
              $rsp = SubscriptionService::addSubscription($get);
              break;
						case 'raw' :
            	$rsp = SubscriptionService::getRaw($get);
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
              	$rsp = SubscriptionService::updateAutoDownload($get);
              	break;
            	case 'delete' :
             		$rsp = SubscriptionService::deleteSubscription($get);
              	break;
            	case 'bulk' :
             		$rsp = SubscriptionService::getAllMedia($get);
              	break;             	
              	
        }
        parent::jsonResponse($rsp);

    }

}
