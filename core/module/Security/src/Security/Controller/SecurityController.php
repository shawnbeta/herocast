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


namespace Security\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class SecurityController extends AbstractActionController{

    public function getAccessAction()
    {
        // Get the access for the current user
        // and return json data
        $access = $this->getServiceLocator()
            ->get('security_service')->getAccess();
        
        return new JsonModel(array('access' => $access));
    }
  
	// This handles both create and change key processing
	public function setAccessTokenAction()
	{
    		
		// Get the key and name values from POST
		$key = $this->getRequest()->getPost('key');	
				
		// Add or update the Access Token
		$rsp = $this->getServiceLocator()
		    ->get('token_service')->setAccess($key);		

		// Return json formatted array.
		return new JsonModel($rsp);		
	}
		
	public function validateAccessTokenAction()
	{
		
		// Get the params from POST
		$request = $this->getRequest();
		$key = $request->getPost('key');
		$name = $request->getPost('name');
		
		// Validate the key and check
		// name originality.
		$rsp = $this->getServiceLocator()
		  ->get('token_service')->validate($key, $name);
        
		return new JsonModel($rsp);
  }

	public function validateClientTokenAction()
	{
		// Get the access code from POST
		$request = $this->getRequest()->getContent();
			    
		// My JS must be incorrect since I have to do this
		// to render a proper object. I'll look into this 
		// during the next round.
		$data = json_decode($request);
		
		$token = $data->token;
		
		// Validate the token.
		$rsp = $this->getServiceLocator()
		    ->get('client_service')->validate($token);
				
		return new JsonModel($rsp);
	}	
	  
    public function checkDBXAction()
    {
      
      $config_data = $this->getServiceLocator()
        ->get('security_service')->getConfig();
    
        // Check and return if dbx change is okay.
    	return new JsonModel(array('success' => $config_data['change_dbx']));
    }

    // This just sends back a helpful warning
    // message if the config is sent not to 
    // allow modifications to the access key.
    // On submit config will be rechecked
    // on the server prior to persisting to db.
    public function checkChangeKeyAction()
    {
        $rsp = $this->getServiceLocator()
            ->get('security_service')->checkChangeKey();

        return new JsonModel($rsp);
    }
    
    public function logoutAction()
	{
	    $id = $this->getEvent()->getRouteMatch()->getParams()['id'];
	    
	    // Remove the client.
	    $this->getServiceLocator()
	       ->get('client_service')->delete($id);	  
	      
		// All there is to do is change the access value.
		$this->getServiceLocator()
            ->get('security_service')->setAccess(False);
		
		return new JsonModel(array('success' => TRUE));
	}
	
	public function deleteClientAction()
	{
	    // Retrive the id from GET.
	    $id = $this->getEvent()->getRouteMatch()->getParams()['id'];
	     
	    // Remove the client.
	    $clients = $this->getServiceLocator()
	       ->get('client_service')->delete($id);
	    
	    return new JsonModel(array('success' => true, 'clients' => $clients));
	}
	
	public function getClientsAction()
	{
	    // Remove the client.
	    $clients = $this->getServiceLocator()
	       ->get('client_service')->getAll();

	    return new JsonModel(array('success' => true, 'clients' => $clients));
	    
	    
	}
}