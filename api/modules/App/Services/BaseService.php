<?php

namespace ShawnBeta\App\Services;

use Symfony\Component\Yaml\Parser;

class BaseService {

  protected static function buildArray($input)
  {
  	$output = array();

  	foreach ($input as $value) {
  		array_push($output, (array) $value);
  	}
  	return $output;
  }

  protected static function getSettings()
  {
  	$config = new Parser();
  	$settings = $config->parse(file_get_contents('config/settings.yaml'));
  	return $settings;
  }
  
  protected static function getDatabase()
  {
  	$config = new Parser();
  	$db = $config->parse(file_get_contents('config/db.yaml'));
  	return $db;
  }
  
  public static function pubGetSettings()
  {
  	return self::getSettings();
  }
  
  public static function pubGetDatabase()
  {
  	return self::getDatabase();
  }
  
}
