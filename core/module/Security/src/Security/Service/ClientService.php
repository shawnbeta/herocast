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

use Security\Entity\ClientEntity;
use Zend\Crypt\Password\Bcrypt;

class ClientService {

    protected $om;
    
    public function __construct($om)
    {
        $this->om = $om;
    }
    
	public function add($name)
	{
				
		// Set the date var for use
		// with create_date and initial
		// modified date.
		$date = new \DateTime('now');
		
		// Generate a random token.
		$bcrypt = new Bcrypt();
		$token = $bcrypt->create($name . rand(420, 15800));

		// Build the new client Entity
		$newClient = new ClientEntity(); 
		$newClient->__set('token', $token);
		$newClient->__set('name', $name);
		$newClient->__set('create_date', $date);
		$newClient->__set('modified_date', $date);
        
		// Save to db.
		$this->om->persist($newClient);
		$this->om->flush();
		
		return array('token' => $token, 'id' => $newClient->__get('id'));
	}
	
	public function getOneBy($type, $value)
	{
	    // Use Doctrine to return a single result
	    // based on type (id, token) and related value.
	    return $this->om->getRepository('Security\Entity\ClientEntity')
	       ->findOneBy(array($type => $value));	       
	}
	
	public function delete($id)
	{
	    // Fetch the client by id
	    $client = $this->getOneBy('id', $id);
	    
	    // If found remove the client
	    if($client)
	       $this->om->remove($client);	    
	    $this->om->flush();
	    
	    // Return the updated client list.
	    return $this->getAll();
	}
	
	public function getAll()
	{
	    // Use Doctrine to fetch all clients.
	    $rsp = $this->om->getRepository('Security\Entity\ClientEntity')
	       ->findAll();
		
		// Iterate over client objects adding
		// array copies to client array.
		foreach ($rsp as $c){
			$clients[] = $c->getArrayCopy();
		}
				
        return $clients;
	}
	
	public function validate($token)
	{
	    $client = $this->getOneBy('token', $token);
	    
	    // If the access code exist give the user access
	    // and send back a positive response.
	    if($client){
	        
	        // Give user access via Session
	        SecurityService::setAccess(TRUE);	        
	        return array('success' => true);
	    }
	    
	    // If the code doesn't match send back
	    // failure notification.
	    return array(
	        'msg' => 'Incorrect access code.',
	        'success' => false
	    );
	}
}

?>