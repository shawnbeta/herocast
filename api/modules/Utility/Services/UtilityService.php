<?php

namespace ShawnBeta\Utility\Services;

class UtilityService{

  public static function machinify($text)
  {
    $string = str_replace(' ', '-', $text); // Replaces all spaces with hyphens.
    $string2 = preg_replace('/[^A-Za-z0-9\-]/', '', $string);
    $rsp = strtolower($string2);
    return $rsp;
  }

  public static function isJSON($string){
		return is_string($string) 
		&& is_object(json_decode($string)) 
		&& (json_last_error() == JSON_ERROR_NONE) ? true : false;
	}
}
