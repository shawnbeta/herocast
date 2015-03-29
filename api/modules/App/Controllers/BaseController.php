<?php

namespace ShawnBeta\App\Controllers;


use ShawnBeta\Utility\Services\UtilityService;

class BaseController {

  public static function jsonResponse($rsp)
  {
  	print_r( UtilityService::isJSON($rsp) ? $rsp : json_encode($rsp));

  }
}
