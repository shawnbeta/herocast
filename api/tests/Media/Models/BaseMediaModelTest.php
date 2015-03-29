<?php
/**
 * Created by PhpStorm.
 * User: shawn
 * Date: 2/9/15
 * Time: 4:31 PM
 */

namespace ShawnBeta\Media\Models;

class BaseMediaModel {

    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    protected $id;

    /** @Column(type="string", name="title" ) */
    protected $title;

    /** @Column(type="text", name="description" ) */
    protected $description;

    /** @Column(type="text", name="src" ) */
    protected $src;

    /** @Column(type="text", name="img", nullable=true ) */
    protected $image;

    /** @Column(type="bigint", name="created_date") */
    protected $createdDate;

    /** @Column(type="bigint", name="modified_date") */
    protected $modifiedDate;

    public function setId($id)
    {
        $this->id = $id;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function setSrc($src)
    {
        $this->src = $src;
    }

    public function setImage($image)
    {
        $this->image = $image;
    }

    public function setCreateDate($createdDate)
    {
        $this->createdDate = $createdDate;
    }

    public function setModifiedDate($modifiedDate)
    {
        $this->modifiedDate = $modifiedDate;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getSrc()
    {
        return $this->src;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function getCreateDate()
    {
        return $this->create_date;
    }

    public function getModifiedDate()
    {
        return $this->modified_date;
    }
}
