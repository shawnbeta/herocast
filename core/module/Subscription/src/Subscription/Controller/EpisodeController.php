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

class EpisodeController extends ApplicationController{
  
    public function getAction()
    {
  	
        // Give em the boot if not authorized.
        $this->checkAccess();
        
        // Get parameters
        $params = $this->getEvent()->getRouteMatch()->getParams();
        
        // If coming from refresh set option to first page
        // and the subscriptions query to all.
        if(!isset($params['option']) ||!isset($params['id'])){
            $params = array('option' => 1, 'id' => 'all');
        }
         
        // Get the page and subscription id params.
        $page = $params['option'];
         
        // If the id parameter isn't all then include the
        // subscription id to limit episodes to a specific subscription.
        $subscription = $params['id']!=  'all' ? $params['id'] : false;
        
        // Send page and subscription information over to
        // the episode service to wrap things up.
        $rsp = $this->getServiceLocator()
            ->get('episode_service')->get($page, $subscription);
            
        return new JsonModel($rsp);
  }	

    public function refreshAction()
    {
        
        // Run refresh in the service
        $rsp = $this->getServiceLocator()
            ->get('episode_service')->refresh();
    		
    	return new JsonModel($rsp);    	
    }

    public function setWatchedAction()
    {

        // Give em the boot if not authorized.
        $this->checkAccess();
                
        // Get the args
        $params = $this->getEvent()->getRouteMatch()->getParams();

        // Set watched
        $rsp = $this->getServiceLocator()
            ->get('episode_service')->setWatched($params);
        
        // Return JSON
        return new JsonModel($rsp);
    }

    public function setBookmarkAction()
    {
        
        // Give em the boot if not authorized.
        $this->checkAccess();
                
        // Get the args
        $params = $this->getEvent()->getRouteMatch()->getParams();
        
        // Set the bookmark
        $rsp = $this->getServiceLocator()
            ->get('episode_service')->setBookmark($params);
        
        // Return JSON
        return new JsonModel($rsp);
    }
    
	public function copyToServerAction()
	{
		// Disconnect the session to free up the browser.
		session_write_close();

		// Get the parameters.
		$params = $this->getEvent()->getRouteMatch()->getParams();
		
		$rsp = $this->getServiceLocator()
		    ->get('episode_service')->copyToServer($params);
		
		// Return JSON
		return new JsonModel($rsp);
		
	}
 		
 		
	// This is a placeholder to work things
	// out so when refresh and autorefresh 
	// are up and running the code can 
	// just be dropped in.
	public function deleteByAgeAction()
	{
	    $es = $this->getServiceLocator()
	      ->get('episode_service')->deleteByAge();
	    
	    // Return JSON
	    return new JsonModel(array('success' => true));
	    
	}



}

?>