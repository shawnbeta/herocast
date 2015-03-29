<?php
/**
 * Created by PhpStorm.
 * User: shawn
 * Date: 2/9/15
 * Time: 4:30 PM
 */

namespace ShawnBeta\Media\Models;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * @Entity
 *  @Table(name="subscriptions")
 */
class Subscription extends BaseMediaModel {

    /** @Column(type="text", name="subscription_type" ) */
    protected $subscriptionType;

    /** @Column(type="text", name="homepage", nullable=true ) */
    protected $homepage;

    /** @Column(type="text", name="machine_name" ) */
    protected $machineName;

    /** @Column(type="text", name="auto_download" ) */
    protected $autoDownload;

    /**
     * @OneToMany(targetEntity="Episode", mappedBy="episode", cascade={"all"})
     **/
    private $episodes;

    function __construct(){
        $this->episodes = new ArrayCollection();
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

    public function addEpisode(Episode $episode)
    {
    	$this->episodes->add($episode);
    	$episode->setSubscription($this);
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



    public function toString()
    {
        return "ID: " + $this->id + "\n " +
        "Title: "+ $this->title + "\n " +
        "Description: "+ $this->description + "\n " +
        "SRC: "+ $this->src + "\n " +
        "Image: " + $this->image + "\n " +
        "Type: " + $this->subscriptionType + "\n " +
        "Auto Download: " + $this->autoDownload;
    }





}
