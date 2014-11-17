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
 * @package  module/Subscription
 * @author   Shawn Williams <shawnbeta@outlook.com>
 * @license  GNU/LGPL http://www.gnu.org/licenses/lgpl-3.0.html
 * @link     http://herocast.shawnbeta.com
 */


namespace Subscription\Controller;

use Zend\View\Model\JsonModel;

use Application\Controller\ApplicationController;

class SubscriptionController extends ApplicationController{
    
    public function getAction()
	{		
        // Give em the boot if not authorized.
        $this->checkAccess();
        
        $rsp = $this->getServiceLocator()
            ->get('subscription_service')->getAll();

		return new JsonModel($rsp);
	}

	public function setAction()
	{
	    // Give em the boot if not authorized.
	    $this->checkAccess();	    
	    
		// Get the url from post
		$request = $this->getRequest();
		
		// Get the params from POST
		$src = $request->getPost('src');
		$type = $request->getPost('type');
		
		$rsp = $this->getServiceLocator()
		  ->get('subscription_service')->set($src, $type);

		return new JsonModel($rsp);
	}	

	public function downloadAction()
	{
	    // Give em the boot if not authorized.
	    $this->checkAccess();
	    
		// Get the route params	
	    $params = $this->getEvent()->getRouteMatch()->getParams();
		
		// Set the subscription
		$rsp = $this->getServiceLocator()->get('subscription_service')
		  ->download($params);

		return new JsonModel($rsp);		
		
	}
	
	public function deleteAction()
	{
	    // Give em the boot if not authorized.
	    $this->checkAccess();
	    
	    // Get the route params
	    $params = $this->getEvent()->getRouteMatch()->getParams();

		// Delete the subscription
		$rsp = $this->getServiceLocator()->get('subscription_service')
            ->delete($params);			
		
		return new JsonModel($rsp);		
	}
	
}

?>