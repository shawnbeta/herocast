<?php

namespace Modules\Media\DataMaps;

use Modules\Utility\Services\DB;


class EpisodeDataMap {
	
	public static function saveEpisodes($episodes)
	{
		
		$fields = 'title, description, src, img, pub_date, watched, bookmark, create_date, modified_date, subscription';		
		try{
			$dbc = DB::getConn();
			$dbc->beginTransaction();
			$stmt = $dbc->prepare("INSERT INTO episodes ($fields) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		
			foreach($episodes as $episode){
				$episode_db_array = array_values($episode);
				//var_dump($episode);
				//var_dump($episode_db_array);
				$stmt->execute($episode_db_array);
			}
			$dbc->commit();
		} catch(\PDOException $e)
		{
			echo 'Error: ' . $e->getMessage();
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