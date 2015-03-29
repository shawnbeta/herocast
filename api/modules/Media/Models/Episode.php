<?php
namespace ShawnBeta\Media\Models;

class Episode extends BaseMediaModel {

    private $pubDate;
    private $duration;
    private $watched;
    private $bookmark;
    private $subscriptionId;

    public function setPubDate($pubDate)
    {
        $this->pubDate = $pubDate;
    }
    
    public function setDuration($duration)
    {
    	$this->duration = $duration;
    }
    
    public function setWatched($watched)
    {
        $this->watched = $watched;
    }

    public function setBookmark($bookmark)
    {
        $this->bookmark = $bookmark;
    }

    public function setSubscriptionId($subscriptionId)
    {
    	$this->subscriptionId = $subscriptionId;
    }    

    public function getPubDate()
    {
        return $this->pubDate;
    }

    public function getDuration(){
    	return $this->duration;
    }
    
    public function getWatched()
    {
        return $this->watched;
    }

    public function getBookmark()
    {
        return $this->bookmark;
    }

    public function getSubscriptionId()
    {
    	return $this->subscriptionId;
    }
     
    public function toString()
    {
        return "ID: " + $this->id + "<br/> " +
        "Title: "+ $this->title + "<br/> " +
        "Description: "+ $this->description + "<br/> " +
        "SRC: "+ $this->src + "<br/> " +
        "Image: " + $this->image + "<br/> " +
        "Publish Date: " + $this->pubDate + "<br/> " +
        "Duration: " + $this->duration + "<br/> " +
        "Modified Date: " + $this->modifiedDate + "<br/> " +
        "Watched: " + $this->watched + "<br/> " +
        "Bookmark" + $this->bookmark + "<br/> " +
        "Subscription:" +$this->subscription;
    }
    
    public function getArray()
    {
    	 
    	$childValues = array(
    			'pub_date' => $this->getPubDate(),
    			'duration' => $this->getDuration(),
    			'watched'	=> $this->getWatched(),
    			'bookmark' => $this->getBookmark(),
    			'subscription_id'	=> $this->getSubscriptionId()
    	);
    	 
    	return array_merge($childValues, parent::makeArray());
    
    }
    
    public function getModel($data)
    {
    	$this->setId($data['id']);
    	$this->setTitle($data['title']);
    	$this->setDescription($data['description']);
    	$this->setSrc($data['src']);
    	$this->setImage($data['img']);
    	$this->setWatched($data['watched']);
    	$this->setBookmark($data['bookmark']);
    	$this->setPubDate($data['pub_date']);
    	$this->setDuration($data['duration']);
    	$this->setCreateDate($data['create_date']);
    	$this->setModifiedDate($data['modified_date']);
    	$this->setSubscriptionId($data['subscription_id']);
    	return $this;
    }
}
