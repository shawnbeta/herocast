<?php

namespace ShawnBeta\Media\PDO;

use ShawnBeta\Utility\Services\DBConn;

class SubscriptionPDO {
	
	public static function persistSubscription($subscription) {
		$subscription = $subscription->getArray ();
		//var_dump($subscription);
		unset ( $subscription ['id'] );
		$subscription = array_values ( $subscription );

		//extract($subscription);
		//var_dump($subscription);
		
		$fields = 'subscription_type, machine_name, home_page, auto_download, 
			title, description, src, img, create_date, modified_date';
		
		try {
			
			$dbc = new DBConn ();
			$dbc->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
			$stmt = "INSERT INTO subscriptions ($fields) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			$query = $dbc->prepare ($stmt);

//			$query->bindParam(1, $subscription_type);
//			$query->bindParam(2, $machine_name);
//			$query->bindParam(3, $home_page);
//			$query->bindParam(4, $auto_download);
//			$query->bindParam(5, $title);
//			$query->bindParam(6, $description);
//			$query->bindParam(7, $src);
//			$query->bindParam(8, $img);
//			$query->bindParam(9, $create_date);
//			$query->bindParam(10, $modified_date);

			try {
				$dbc->beginTransaction ();
				$query->execute($subscription);
			  	$sid = $dbc->lastInsertId();
				$dbc->commit ();

				//print "Last ID: " . $sid;
				return $sid;
			} catch ( \PDOException $e ) {
				echo 'Error: ' . $e->getMessage ();
			}
			
			// echo $STH->rowCount(); // 1
		} catch ( \PDOException $e ) {
			echo 'Error: ' . $e->getMessage ();
		}
	}
	public static function fetchIDAndSRC() {
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare ( "SELECT (id, src) FROM subscriptions" );
			$query = $dbc->query ( $stmt );
			$result = $query->setFetchMode ( PDO::FETCH_ASSOC );
			return $result;
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}
	public static function fetchSubscriptionsModifiedBefore($date) {
		try {
			$dbc = new DBConn ();
			$select = "";
			$stmt = $dbc->prepare ( "SELECT title, description, src, img, subscription_type, home_page, auto_download, create_date, modified_date FROM subscriptions WHERE modified_date > :date" );
			$stmt->bindParam ( ':date', $date );
			$stmt->setFetchMode ( \PDO::FETCH_ASSOC );
			$stmt->execute ();
			return $result;
		} catch ( Exception $e ) {
			echo 'Error: ' . $e->getMessage ();
		}
	}
	
	public static function fetchSubscriptionsModifiedAfter($date) {
		try {
			$dbc = new DBConn ();
			$select = "";
			$stmt = $dbc->prepare ( "SELECT title, description, src, img, subscription_type, home_page, auto_download, create_date, modified_date FROM subscriptions WHERE modified_date > :date" );
			$stmt->bindParam ( ':date', $date );
			// $query = $dbc->query($stmt);
			$stmt->setFetchMode ( \PDO::FETCH_ASSOC );
			$stmt->execute ();
			$result = $stmt->fetchAll();
			return $result;
		} catch ( Exception $e ) {
			echo 'Error: ' . $e->getMessage ();
		}
	}	
	
	public static function fetchSubscriptionAndEpisodesByPubDate($date) {
			try {
			$dbc =  new DBConn();
			$stmt = $dbc->prepare(
					"SELECT subscriptions.id, machine_name, subscriptions.title, subscriptions.description, subscriptions.src, subscriptions.img, subscription_type, home_page, auto_download, subscriptions.create_date, subscriptions.modified_date, pub_date
FROM subscriptions
LEFT JOIN episodes ON subscriptions.id = episodes.subscription_id
WHERE episodes.pub_date > 1426723260
GROUP BY subscriptions.id
ORDER BY episodes.pub_date DESC 
LIMIT 0 , 30"
					);
			$stmt->bindParam ( ':date', $date );
			$stmt->setFetchMode ( \PDO::FETCH_ASSOC );
			$stmt->execute ();
			$result = $stmt->fetchAll();
			return $result;
		} catch (Exception $e) {
			echo 'Error: ' . $e->getMessage();
		}
	}
	

	public static function fetchAllSubscriptions() {
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare ( "SELECT id, machine_name, title, description, src, img, subscription_type, home_page, auto_download, create_date, modified_date FROM subscriptions");
			$stmt->execute();
			$result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
			//var_dump($result);
			//header('Content-Type: application/json');
			//print json_encode($result, JSON_FORCE_OBJECT);

			return $result;
		} catch (Exception $e) {
			echo 'Error: ' . $e->getMessage();
		}
	}
	
	public static function fetchSubscriptionsWithLatestEpisode()
	{
		try {
			$dbc =  new DBConn();
			$stmt = $dbc->prepare(
					"SELECT subscriptions.id, machine_name, 
					subscriptions.title, subscriptions.description, 
					subscriptions.src, subscriptions.img, 
					subscription_type, home_page, auto_download, 
					subscriptions.create_date, subscriptions.modified_date, pub_date
						FROM subscriptions
						LEFT JOIN episodes ON subscriptions.id = episodes.subscription_id
						GROUP BY subscriptions.id
						ORDER BY episodes.pub_date DESC
						LIMIT 0 , 30"
					);
			$stmt->execute();
			$result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
			//var_dump($result);
			return $result;
		} catch (Exception $e) {
			echo 'Error: ' . $e->getMessage();
		}
	}
		
	public static function removeSubscription($id)
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare ( 
					"DELETE FROM subscriptions
					WHERE id = :id"
					);
			$stmt->bindParam ( ':id', $id );
			//$stmt->setFetchMode ( \PDO::FETCH_ASSOC );
			$stmt->execute ();
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}
	
	public static function deleteAll()
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare (
					"DELETE FROM subscriptions"
			);
			$stmt->execute ();
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}
		
	
	public static function fetchSubscription($id)
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare ( 
					"SELECT * FROM subscriptions
					WHERE id = :id"
					);
			$stmt->bindParam ( ':id', $id );
			$stmt->setFetchMode ( \PDO::FETCH_ASSOC );
			$stmt->execute ();
			$result = $stmt->fetch();
			return $result;
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}
	
	public static function updateAutoDownload($g)
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare ( 
					"UPDATE subscriptions
					SET auto_download = :val,
					modified_date = :date
					WHERE id = :id"
					);
			$date = new \DateTime();
			$dateInt = strtotime($date->format('Y-m-d H:i:s'));
			$stmt->bindParam ( ':date', $dateInt );
			$stmt->bindParam ( ':id', $g['id'] );
			$stmt->bindParam ( ':val', $g['val'] );
			//$stmt->setFetchMode ( \PDO::FETCH_ASSOC );
			$stmt->execute ();
			$stmt->fetch();
			//return $result;
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}
	
    /*
     * DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `machine_name` varchar(120) NOT NULL,
  `description` text NOT NULL,
  `src` text NOT NULL,
  `home_page` longtext NOT NULL,
  `img` text NOT NULL,
  `subscription_type` varchar(80) NOT NULL,
  `auto_download` tinyint(1) NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=61 ;
     *
     *  */
}