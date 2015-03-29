<?php
/**
 * Created by PhpStorm.
 * User: shawn
 * Date: 2/9/15
 * Time: 4:32 PM
 */

namespace ShawnBeta\Media\Models;

use Doctrine\Common\Proxy\Exception\InvalidArgumentException;
/**
 * @Entity
 *  @Table(name="episodes")
 */
class Episode extends BaseMediaModel {

    /** @Column(type="bigint", name="pub_date" ) */
    private $pubDate;

    /** @Column(type="boolean", name="watched" ) */
    private $watched;

    /** @Column(type="decimal", name="bookmark" ) */
    private $bookmark;

    /**
     * @ManyToOne(targetEntity="Subscription", cascade={"all"})
     **/
    private $subscription;

    public function setPubDate($pubDate)
    {
        $this->pubDate = $pubDate;
    }

    public function setWatched($watched)
    {
        $this->watched = $watched;
    }

    public function setBookmark($bookmark)
    {
        $this->bookmark = $bookmark;
    }

    public function setSubscription($subscription)
    {
    	if($subscription === null | $subscription instanceof Subscription){
    		$this->subscription = $subscription;
    	}else{
    		throw new InvalidArgumentException('$subscription must be an instance of subscription.');
    	}
    }

    public function getPubDate()
    {
        return $this->pubDate;
    }

    public function getWatched()
    {
        return $this->watched;
    }

    public function getBookmark()
    {
        return $this->bookmark;
    }

    public function getSubscription()
    {
        return $this->subscription;
    }

    public function toString()
    {
        return "ID: " + $this->id + "<br/> " +
        "Title: "+ $this->title + "<br/> " +
        "Description: "+ $this->description + "<br/> " +
        "SRC: "+ $this->src + "<br/> " +
        "Image: " + $this->image + "<br/> " +
        "Publish Date: " + $this->pubDate + "<br/> " +
        "Modified Date: " + $this->modifiedDate + "<br/> " +
        "Watched: " + $this->watched + "<br/> " +
        "Bookmark" + $this->bookmark + "<br/> " +
        "Subscription:" +$this->subscription;
    }
}
