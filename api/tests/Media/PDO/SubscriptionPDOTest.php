<?php
/**
 * Created by PhpStorm.
 * User: shawn
 * Date: 1/20/15
 * Time: 6:44 PM
 */

namespace Modules\Media\DataMaps;

use Modules\Utility\Services\DB;

class SubscriptionDataMap {
	
	
	public static function saveSubscription($subscription)
	{
		
		//var_dump($subscription);
		$subscription = array_values($subscription);
		//var_dump($subscription);
		
		$fields = 'title, description, home_page, img, machine_name, 
				src, media_type, auto_download, create_date, modified_date';
		
		try{
			$dbc = DB::getConn();
			$stmt = $dbc->prepare("INSERT INTO subscriptions ($fields) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			
			//var_dump($stmt);
		
			try{
				$dbc->beginTransaction();
				$stmt->execute($subscription);
				$sid = $dbc->lastInsertId();
				$dbc->commit();
				//print "Last ID: " . $sid;
				return $sid;
			} catch(\PDOException $e)
			{
				echo 'Error: ' . $e->getMessage();
			}
		
		
			//echo $STH->rowCount(); // 1
		} catch(\PDOException $e)
		{
			echo 'Error: ' . $e->getMessage();
		}
	}
	


    /*$string = "'CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `src` text NOT NULL,
  `image` text NOT NULL,
  `type` varchar(80) NOT NULL,
  `auto_download` tinyint(1) NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;' "; */
}