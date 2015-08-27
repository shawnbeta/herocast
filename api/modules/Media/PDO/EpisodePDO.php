<?php

namespace ShawnBeta\Media\PDO;

use ShawnBeta\Utility\Services\DBConn;

class EpisodePDO{
	
	public static function persistEpisodes($episodesCollection)
	{
		$fields = 'pub_date, duration, watched, bookmark, subscription_id, title, 
				description, src, img, create_date, modified_date';		
		try{
			$dbc = new DBConn();
			$dbc->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
			$dbc->beginTransaction();
			$stmt = $dbc->prepare("INSERT INTO episodes ($fields) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			
			foreach($episodesCollection as $episode){
				
				$episodeData = $episode->getArray();
				
				unset($episodeData['id']);
				
				
				$stmt->execute(array_values($episodeData));
			}
			$dbc->commit();
		} catch(\PDOException $e)
		{
			echo 'Error: ' . $e->getMessage();
		}
		
		
		
	}

	public static function fetchEpisodesModifiedBefore($date)
	{
		try {
			$dbc =  new DBConn();
			$stmt = $dbc->prepare("SELECT title, description, src, img, watched, bookmark, pub_date, duration, create_date, modified_date, subscription_id FROM episodes WHERE pub_date < :date");
			$stmt->bindParam(':date', $date);
			$stmt->setFetchMode(\PDO::FETCH_ASSOC);
			$stmt->execute();
			return $result;
		} catch (Exception $e) {
			echo 'Error: ' . $e->getMessage();
		}
	}
	
	public static function fetchEpisodesModifiedAfter($date)
	{
		try {
			$dbc =  new DBConn();
			$stmt = $dbc->prepare("SELECT title, description, src, img, watched, bookmark, pub_date, duration, create_date, modified_date, subscription_id FROM episodes WHERE pub_date > :date");
			$stmt->bindParam(':date', $date);
			$stmt->setFetchMode(\PDO::FETCH_ASSOC);
			$stmt->execute();
			return $result;
		} catch (Exception $e) {
			echo 'Error: ' . $e->getMessage();
		}
	}
	
	public static function fetchEpisodesBySubscription($subscription_id)
	{
		try {
			$dbc =  new DBConn();
			$stmt = $dbc->prepare(
					"SELECT id, title, description, src, 
					img, watched, bookmark, pub_date, duration, 
					create_date, modified_date, subscription_id 
					FROM episodes 
					WHERE subscription_id = :subscription_id");
			$stmt->bindParam(':subscription_id', $subscription_id);
			$stmt->execute();
			$result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
			return $result;
		} catch (Exception $e) {
			echo 'Error: ' . $e->getMessage();
		}
	}	
	
	public static function fetchAllEpisodes()
	{
		try {
			$dbc =  new DBConn();
			$select = "";
			$stmt = $dbc->prepare("SELECT id, title, description, src, img, watched, bookmark, pub_date, duration, create_date, modified_date, subscription_id FROM episodes");
			$stmt->execute();
			$result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
			return $result;
		} catch (Exception $e) {
			echo 'Error: ' . $e->getMessage();
		}
	}
	
	public static function fetchEpisode($id)
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare ( 
					"SELECT * FROM episodes
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
	
	public static function updateWatched($g)
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare (
					"UPDATE episodes
					SET watched = :val,
					modified_date = :date
					WHERE id = :id"
					);
			$date = new \DateTime();
			$dateInt = strtotime($date->format('Y-m-d H:i:s'));
			$stmt->bindParam ( ':date', $dateInt );
			$stmt->bindParam ( ':id', $g['id'] );
			$stmt->bindParam ( ':val', $g['val'] );
			$stmt->execute ();
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}
	
	public static function updateBookmark($g)
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare (
					"UPDATE episodes
					SET bookmark = :val,
					modified_date = :date
					WHERE id = :id"
					);
			$date = new \DateTime();
			$dateInt = strtotime($date->format('Y-m-d H:i:s'));
			$stmt->bindParam ( ':date', $dateInt );
			$stmt->bindParam ( ':id', $g['id'] );
			$stmt->bindParam ( ':val', $g['val'] );
			$stmt->execute ();
			$result = $stmt->fetch();
			return $result;
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}
	
	public static function updateSRC($g, $url)
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare (
					"UPDATE episodes
					SET src = :src,
					modified_date = :date
					WHERE id = :id"
			);
			$date = new \DateTime();
			$dateInt = strtotime($date->format('Y-m-d H:i:s'));
			$stmt->bindParam ( ':date', $dateInt );
			$stmt->bindParam ( ':id', $g['id'] );
			$stmt->bindParam ( ':src', $url );
			$stmt->execute ();
			$result = $stmt->fetch();
			return $result;
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}	
	
	public static function removeEpisodes($subscription_id)
	{
		try {
			$dbc = new DBConn ();
			$stmt = $dbc->prepare ( 
					"DELETE FROM episodes
					WHERE subscription_id = :subscription_id"
					);
			$stmt->bindParam ( ':subscription_id', $subscription_id );
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
					"DELETE FROM episodes"
			);
			$stmt->execute ();
		} catch ( Exception $e ) {
			return 'Error: ' . $e->getMessage ();
		}
	}	
    /*public function makeTable()
    {
        $string = " 'CREATE TABLE IF NOT EXISTS episodes (
  id int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `src` text NOT NULL,
  `img` text,
  `watched` tinyint(1) DEFAULT NULL,
  `bookmark` float DEFAULT NULL,
  `pub_date` datetime NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_date` datetime DEFAULT NULL,
  `subscription` int(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1";
    }*/

}