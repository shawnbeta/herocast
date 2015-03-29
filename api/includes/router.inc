<?php

use ShawnBeta\App\Controllers\AppController;
use ShawnBeta\Media\Controllers\SubscriptionController;
use ShawnBeta\Media\Controllers\EpisodeController;
use ShawnBeta\Media\Controllers\SearchController;

if(isset($_GET['entity'])){
  switch ($_GET['entity']) {
    case 'subscription' :
      SubscriptionController::getAction($_GET);
      break;
    case 'episode' :
      EpisodeController::getAction($_GET);
      break;
      case 'search' :
      	SearchController::getAction($_GET);
      	break;
      	case 'app' :
      		AppController::getAction($_GET);
      		break;      	
    default :
      print 'no dice';
      break;
  }


}

