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

namespace Security\Service;

use Zend\Config\Reader\Json as jRead;
use Zend\Session\Container;

class SecurityService {
	
	// Returns the config file as an array.
	public static function getConfig()
	{
		$jObj = new jRead();
		return $jObj->fromFile('config/settings.json');
	}
	
	public static function getAccess()
	{
		$sessionData = new Container('data');
		return $sessionData->hasAccess;
	}

	public static function setAccess($val)
	{
		$sessionData = new Container('data');
		$sessionData->hasAccess = $val;
	}
    
	public function checkChangeKey()
	{
	    // Get the configuration file array
	    $config = $this->getConfig();

	    // Check if token modifications are allowed.
	    if(!$config['change_key'])
	       return array(
	           'success' => false,
	           'msg' => 'you must edit the config file before you can change your key.'
	       );
	       
        return array('success' => true);

	}
	
}

?>