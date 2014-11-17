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
 * @package  module/Utility
 * @author   Shawn Williams <shawnbeta@outlook.com>
 * @license  GNU/LGPL http://www.gnu.org/licenses/lgpl-3.0.html
 * @link     http://herocast.shawnbeta.com
 */

namespace Utility\Controller;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class FileController extends AbstractActionController{
  
  public function getInstructionsAction()
  {
    $rsp = $this->getServiceLocator()
    ->get('file_service')->getInstruction();
    
    return new JsonModel($rsp);
  }
  
  public function authorizeAction()
  {
    $rsp = $this->getServiceLocator()
    ->get('file_service')->authorize();

    return new JsonModel($rsp);
    
  }
  
  public function copyToDBXAction()
  {
  	// Disconnect the session to free up the browser.
  	session_write_close();
  
  	// Get the parameters
  	if(!null == $this->getEvent()->getRouteMatch()->getParams())
  		$params = $this->getEvent()->getRouteMatch()->getParams();
  	  
  	$ctdbx = $this->getServiceLocator()
    ->get('file_service')->copyToDBX($params['id']);
  
  	if($ctdbx){
  		$rsp['success'] = true;
  	}else{ $rsp['success'] = false; }
  
  	return new JsonModel($rsp);
  
  }
}