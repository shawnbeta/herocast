<?php

namespace ShawnBeta\Media\Services;

use ShawnBeta\App\Services\BaseService;
use ShawnBeta\Media\Services\SubscriptionService;
use ShawnBeta\Utility\Services\FileService;
use ShawnBeta\Media\PDO\EpisodePDO;
use ShawnBeta\Media\Models\Episode;

class EpisodeService  {

	public static function getAll()
	{
		return EpisodePDO::fetchAllEpisodes();
	}
	

  public static function getEpisodesDateBefore($g)
  {
		$episodes = EpisodePDO::fetchEpisodesModifiedBefore($g['date']);
		
		return array (
				'msg' => "Episodes BEFORE DATE",
				'episodes' => ( array ) $episodes 
		);
  }

  public static function getEpisodesDateAfter($g)
  {
		return EpisodePDO::fetchEpisodesModifiedAfter($g['date']);
  }

  public static function getEpisodesBySubscription($subscription_id)
  {

  	return EpisodePDO::fetchEpisodesBySubscription($subscription_id);

  }
  
  private static function loadModel($id){
  	// Get the array from database
  	$data = EpisodePDO::fetchEpisode($id);
  	// Load the subscription object
  	$ec = new Episode();
  	$episode = $ec->fromArray($data);
  	return $episode;
  }  
  
	public static function setWatched($g)
	{
		// Doing multiple queries to make sure data is correct.
		$oldEpisode = EpisodePDO::fetchEpisode($g['id']);
		EpisodePDO::updateWatched($g);
		// Verify changes
		$updatedEpisode = EpisodePDO::fetchEpisode($g['id']);
		
		return array (
				'msg' => "Response for setting episode bookmark",
				'old_value' => $oldEpisode['watched'],
				'sent_value' => $g['val'],
				'new_value' => $updatedEpisode['watched'],
				'success' => $updatedEpisode['watched'] === $g['val']
		);
	}
	
	public static function setBookmark($g)
	{		
		// Doing multiple queries to make sure data is correct.
		$oldEpisode = EpisodePDO::fetchEpisode($g['id']);
		EpisodePDO::updateBookmark($g);
		// Verify changes
		$updatedEpisode = EpisodePDO::fetchEpisode($g['id']);
		
		return array (
				'msg' => "Response for setting episode bookmark",
				'old_value' => $oldEpisode['bookmark'],
				'sent_value' => $g['val'],
				'new_value' => $updatedEpisode['bookmark'],
				'success' => $oldEpisode['bookmark'] != $updatedEpisode['bookmark']
		);
	}	

  public static function deleteAll() {
  	return EpisodePDO::deleteAll();
  }
  public static function makeEpisodes($episodes, $subscription) {
  	  	
    $subscriptionMachineName = $subscription->getMachineName();
    $episodesCollection = array();
    
    foreach ($episodes as $episode) {
      // Copy the episode art over to the server
      // and update the file location.
      $episodeImg = $episode->getImage();
      //var_dump($episodeImg);
      if ($episodeImg != null && $episodeImg !== $subscription->getImage()) {
        $episode->setImage(
                FileService::copyToServer($episode->getImage(), 'cover-art', $subscriptionMachineName));
      } else {
      	$image = $episode->setImage($subscription->getImage());
      }

      $episode->setWatched(0);
      $episode->setBookmark(0);
      $date = strtotime(date('Y-m-d H:i:s'));
      $episode->setCreateDate($date);
      $episode->setModifiedDate($date);
      $episode->setSubscriptionId($subscription->getId());     
      array_push($episodesCollection, $episode);
		}
		EpisodePDO::persistEpisodes($episodesCollection);
		return $subscription;
  }

 	public static function copyEpisode($g)
 	{
 		// Doing multiple queries to make sure data is correct.
 		$oldEpisode = EpisodePDO::fetchEpisode($g['id']); 		
 		// Load the subscription Object.
 		$subscription = SubscriptionService::loadModel($oldEpisode['subscription_id']);
 		// Make a copy of the file locally returning the url of the new location

 		$url = FileService::copyToServer($oldEpisode['src'], 'media', $subscription->getMachineName());

 		// Update the episodes src in the db.
 		EpisodePDO::updateSRC($g, $url);
 		// Verify changes
 		$updatedEpisode = EpisodePDO::fetchEpisode($g['id']);
 		
 		return array (
 				'msg' => "Response for copying episode to server",
 				'old_value' => $oldEpisode['src'],
 				'new_value' => $updatedEpisode['src'],
 				'success' => $updatedEpisode['src'] != $oldEpisode['src'], 
 				'url' => $url
 		); 		
 		
 	}

}
