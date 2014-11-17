<?php
/**
 * This source file is part of HeroCast.
 *
 * HeroCast is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HeroCast is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with HeroCast. If not, see <http://www.gnu.org/licenses/lgpl-3.0.html>.
 *
 * PHP Version >=5.4
 *
 * @category HC_App
 * @package  module/Security
 * @author   Shawn Williams <shawnbeta@outlook.com>
 * @license  GNU/LGPL http://www.gnu.org/licenses/lgpl-3.0.html
 * @link     http://herocast.shawnbeta.com
 */


namespace Security\Entity;

use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity
 * @ORM\Table(name="tokens")
 * */
class TokenEntity {
  
  /**
   * @ORM\Id
   * @ORM\Column(type="integer");
   * @ORM\GeneratedValue(strategy="AUTO")
   */
  protected $id;

  /**
   * @ORM\Column(type="string")
   */
  protected $value;

  /**
   * @ORM\Column(type="string")
   */
  protected $name;

  /**
   * @ORM\Column(type="datetimetz")
   */
  protected $create_date;    
  
  /**
   * @ORM\Column(type="datetimetz")
   */
  protected $modified_date;     
  
  /**
  * Magic getter to expose protected properties.
  *
  * @param string $property
  * @return mixed
  */
  public function __get($property) 
  {
      return $this->$property;
  }

  /**
   * Magic setter to save protected properties.
   *
   * @param string $property
   * @param mixed $value
   */
  public function __set($property, $value) 
  {
      $this->$property = $value;
  }

  /**
   * Convert the object to an array.
   *
   * @return array
   */
  public function getArrayCopy() 
  {
      return get_object_vars($this);
  }

  /**
   * Populate from an array.
   *
   * @param array $data
   */
  public function exchangeArray($data = array()) 
  {
      $this->id = $data['id'];
      $this->key = $data['artist'];
      $this->name = $data['title'];
      $this->create_date = $data['overview'];
      $this->modified_date = $data['image'];
  }
  
  
}
