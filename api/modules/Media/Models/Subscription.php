<?php
/**
 * Created by PhpStorm.
 * User: shawn
 * Date: 2/9/15
 * Time: 4:30 PM
 */

namespace ShawnBeta\Media\Models;

class Subscription extends BaseMediaModel {

    protected $subscriptionType;

    protected $homepage;

    protected $machineName;

    protected $autoDownload;

    private $episodes;

    function __construct(){
    	$this->episodes = array();
    }


    public function setSubscriptionType($subscriptionType)
    {
        $this->subscriptionType = $subscriptionType;
    }

    public function setMachineName($machineName)
    {
    	$this->machineName = $machineName;
    }

    public function setHomePage($homepage)
    {
    	$this->homepage = $homepage;
    }

    public function setAutoDownload($autoDownload)
    {
    	$this->autoDownload = $autoDownload;
    }

    public function addSubscriptionEpisode(Episode $episode)
    {
    	array_push($this->episodes, $episode);
    }
    
    public function getSubscriptionType()
    {
        return $this->subscriptionType;
    }

    public function getMachineName()
    {
        return $this->machineName;
    }

    public function getHomePage()
    {
        return $this->homepage;
    }

    public function getAutoDownload()
    {
        return $this->autoDownload;
    }

    public function getEpisodes()
    {
    	return $this->episodes;
    }

    public function getArray()
    {
    	
    	$childValues = array(
    			'subscription_type' => $this->getSubscriptionType(),
    			'machine_name' => $this->getMachineName(),
    			'home_page'	=> $this->getHomePage(),
    			'auto_download' => $this->getAutoDownload(),
    	);

    	return array_merge($childValues, parent::makeArray()); 

    }

		public function getModel($data)
		{
    			$this->setId($data['id']);
    			$this->setTitle($data['title']);
    			$this->setMachineName($data['machine_name']);
    			$this->setDescription($data['description']);
					$this->setSrc($data['src']);
					$this->setImage($data['img']);
					$this->setSubscriptionType($data['subscription_type']);
					$this->setHomePage($data['home_page']);
					$this->setAutoDownload($data['auto_download']);
					$this->setCreateDate($data['create_date']);
					$this->setModifiedDate($data['modified_date']);
					return $this;
		}


}
