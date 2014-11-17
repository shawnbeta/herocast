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

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class SearchController extends AbstractActionController {
	
  public function youtubeAction()
  {
      
      // Get the search term from the form submission
      $request = $this->getRequest();
      $keyword = $request->getPost('keyword');
      
      $rsp = $this->getServiceLocator()
        ->get('youtube_service')->search($keyword);
    
    return new JsonModel($rsp);                 
  }
  
  public function itunesAction()
  {
  
	$request = $this->getRequest();
  	$keyword = $request->getPost('keyword'); 
    
    $url = file_get_contents('https://itunes.apple.com/search?media=podcast&term=' . urlencode($keyword));
    $rsp = json_decode($url);
    
    $responseCollection = array();
    
    foreach ($rsp->results as $item) {
      $itemCollection['title'] = $item->trackName;
      $itemCollection['url'] = $item->feedUrl;
      $itemCollection['img'] = $item->artworkUrl100;
      $responseCollection[] = $itemCollection;
    };

    $return_data = array(
      'success' => true,
      'results' => $responseCollection
    );
          
    return new JsonModel($return_data);

  }
  
}

?>