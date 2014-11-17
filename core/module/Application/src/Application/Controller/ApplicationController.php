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
 * @package  module/Application
 * @author   Shawn Williams <shawnbeta@outlook.com>
 * @license  GNU/LGPL http://www.gnu.org/licenses/lgpl-3.0.html
 * @link     http://herocast.shawnbeta.com
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

use Utility\Service\FuncService;


class ApplicationController extends AbstractActionController
{
    
    public function indexAction(){
        return new JsonModel(array('home' => 'home'));
    }    

    public function checkAccess(){
        if(!$this->getServiceLocator()
            ->get('security_service')->getAccess()){
            return new JsonModel(FuncService::failMsg('Not logged in'));
        }
    }
    
    public function getConfigRootAction()
    {
        // Make sure the user has privelages 
        // to access config
        $this->checkAccess();
        
        $config = $this->getServiceLocator()
            ->get('security_service')->getConfig();
        
        // We only need the root information so..
        $rsp['src_root'] = $config['src_root'];
        $rsp['file_root'] = $config['file_root'];
        
        // Return JSON
        return new JsonModel($rsp);
    }



}
