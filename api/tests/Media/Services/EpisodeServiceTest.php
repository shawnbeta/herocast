<?php

namespace ShawnBeta\Media\Services;

use ShawnBeta\App\Services\BaseService;
use ShawnBeta\Utility\Services\FileService;

class EpisodeService extends \PHPUnit_Framework_TestCase{

  public static function getAllEpisodes() {
  	$episodes = self::getEM()
   		->getRepository('modules\media\models\Episode')
      	->findAll();

        $episodeArray = array();

        foreach ($episodes as $value) {
            array_push($episodeArray, (array) $value);
        }

        return array(
            'msg' => "Here are the episodes",
            'episodes' =>  $episodeArray
        );
  }

  public static function getEpisodeByID($id) {

  	$episode = self::getEM()
  	->getRepository('modules\media\models\Episode')
  	->find($id);

  	return array(
  			'msg' => "Here is the episode",
  			'episode' =>  (array) $episode
  	);

  }

  public static function getEpisodesDateBefore($g)
  {
  	$query = self::getEM()
  	->createQuery('SELECT s FROM modules\media\models\Episode s WHERE s.pubDate < :date');
  	$query->setParameter('date', $g['date']);
  	$episodes = parent::buildArray($query->getResult());

  	return array(
  			'msg' => "Episodes BEFORE DATE",
  			'episodes' =>  (array) $episodes
  	);
  }

  public static function getEpisodesDateAfter($g)
  {
  	$query = self::getEM()
  	->createQuery('SELECT s FROM modules\media\models\Episode s WHERE s.pubDate > :date');
  	$query->setParameter('date', $g['date']);
  	$episodes = parent::buildArray($query->getResult());

  	return array(
  			'msg' => "Episodes AFTER DATE",
  			'episodes' =>  (array) $episodes
  	);
  }

	public static function updateEpisode($g)
	{

    	$em = self::getEM();

    	$episode = $em
    	->getRepository('modules\media\models\Episode')
    	->find($g['id']);

    	if($g['field'] === 'watched')
				$episode->setWatched($g['val']);

    	if($g['field'] === 'bookmark')
    		$episode->setBookmark($g['val']);

    	return array(
    			'msg' => "Here is the episode",
    			'episode' =>  (array) $episode
    	);

    }

  public static function deleteEpisodes($sid) {
    return json_encode(EpisodeDataMap::deleteEpisodes($sid));
  }

  public static function makeEpisodes($episodes, $subscription, $entityManager) {

    $machineName = $subscription->getMachineName();
    
    $sub = $entityManager->getRepository('ShawnBeta\Media\Models\Subscription')
    ->find($subscription->getId());
    
    $subEpisodes = $subscription->getEpisodes();

    foreach ($episodes as $episode) {
    	print 'test';
      // Copy the episode art over to the server
      // and update the file location.
      if ($episode->getImage() != null) {
        $episode->setImage(
                FileService::copyToServer($episode->getImage(), 'cover-art', $machineName));
      } else {
        $episode->setImage(null);
      }

      $episode->setWatched(0);
      $episode->setBookmark(0);
      $date = strtotime(date('Y-m-d H:i:s')) * 1000;
      $episode->setCreateDate($date);
      $episode->setModifiedDate($date);
      $episode->setSubscription($subscription);
      
      $subEpisodes->add($episode);
      

      //$entityManager = self::getEM();
      $entityManager->persist($episode);
      $entityManager->flush();
          }
    $entityManager->flush();
    $entityManager->clear();
		return $subscription;
  }


}
