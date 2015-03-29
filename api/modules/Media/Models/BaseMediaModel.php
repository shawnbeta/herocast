<?php
namespace ShawnBeta\Media\Models;

class BaseMediaModel {

    protected $id;
    protected $title;
    protected $description;

    protected $src;

    protected $image;

    protected $createDate;

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

    public function setCreateDate($createDate)
    {
        $this->createDate = $createDate;
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
        return $this->createDate;
    }

    public function getModifiedDate()
    {
        return $this->modifiedDate;
    }
    
    public function makeArray()
    {
    	return array(
    			'id' => $this->getId(),
    			'title'	=> $this->getTitle(),
    			'description' => $this->getDescription(),
    			'src' => $this->getSrc(),
    			'img' => $this->getImage(),
    			'create_date' => $this->getCreateDate(),
    			'modified_date' => $this->getModifiedDate()
    	);
    }
    
    
}
