<?php

namespace ShawnBeta\App\Services;


class BaseService {

  protected static function buildArray($input)
  {
  	$output = array();

  	foreach ($input as $value) {
  		array_push($output, (array) $value);
  	}
  	return $output;
  }

}
