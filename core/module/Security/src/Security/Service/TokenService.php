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

use Security\Entity\TokenEntity;


class TokenService {
    
    protected $om;
    
    public function __construct($om)
    {
        $this->om = $om;
    }
  
    public function setAccess($key)
    {
        
        // Retrive the access token if it exist.
        $existing_token = $this->getToken('access_token');

        // Get CHANGE KEY setting value
        // from the configuration file
        // to determine if modification is allowed.
        $config = SecurityService::getConfig();         
        
        // Stop if token already exist and change key isn't true.
        if($existing_token && !$config['change_key'])
            return array(
                'msg' => 'Before changing your key you have to edit the config.json file.',
                'success' => false
            );
            
        // Encrypt the password.
        $value = password_hash($key, PASSWORD_BCRYPT);

        $this->makeToken('access_token', $value, $existing_token);
        
        return array(
            'success' => true,
            'msg' => 'Key saved! <a href="#/security/validate">Click to validate and get access.</a>'
        );
        
    }
    
    public function setDBXToken($key)
    {
        // Retrive the access token if it exist.
        $existing_token = $this->getToken('dbx_token');
        
        // Get configuration
        $config = SecurityService::getConfig();
        
        // Stop if token already exist and change key isn't true.
        if(!$config['change_dbx'])
            return array(
                'msg' => 'Before changing your key you have to edit the config.json file.',
                'success' => false
            );
        
            $this->makeToken('dbx_token', $key, $existing_token);
        
            return array(
                'success' => true,
                'msg' => 'Key saved! <a href="#/security/validate">Click to validate and get access.</a>'
            );        
    }
    
    public function makeToken($name, $key, $existing_token)
    {
        
        // If access key exist, delete it.
        if($existing_token)
            $this->delete($existing_token);
        
        // Set the date variable to use
        // with create data and modified date.
        $date = new \DateTime('now');
        
        // Make the new token entity
        $token = new TokenEntity;
        $token->__set('name', $name);
        $token->__set('value', $key);
        $token->__set('create_date', $date);
        $token->__set('modified_date', $date);
        
        // Save to db.
        $this->om->persist($token);
        $this->om->flush();
        
        return;
    }
	
	public function getToken($name)
	{
	    return $this->om->getRepository('Security\Entity\TokenEntity')
            ->findOneBy(array('name' => $name));
	}
	
	public function delete($existing_token)
	{
	    $this->om->remove($existing_token);
	    $this->om->flush();
	}

	public function validate($key, $name)
	{
	    // Get the new client service.
	    $cs = new ClientService($this->om);
	    
	    // Check client name for originality
	    // Return an error if client name exist.
	    if($cs->getOneBy('name', $name))
	        return array('success' => false, 'msg' => 'There is already a client with this name.');
	    
	    // Retrive the saved access token.
	    $saved_access_token = $this->getToken('access_token');
	    
	    // Retrieve the value of the from the obj.
	    $cat = $saved_access_token->__get('value');
	    
	    if(password_verify($key, $cat)){
	        	
	        // Set and save the new client in the
	        // database and return client token.
	        // to the database.
	        $client = $cs->add($name);
	        	
	        // Set access in session
	        SecurityService::setAccess(TRUE);
	    
	        // Return the response with the access code
	        return array(
	            'success' => true,
	            'client_id' => $client['id'],
	            'client_token' => $client['token']
	        );
	    }
	    else {
	        return array(
	            'success' => false,
	            'msg'     => 'Incorrect access code.',
	        );
	    }	    
	    
	}
	
}

?>