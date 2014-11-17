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

namespace Application\Service;

class MenuService {
	
	public static function noAccess()
	{
		
		return array(
				array(
						'link' => 'security/validate',
						'title' => 'Enter Your Key'
				),
				array(
						'link' => 'security/create',
						'title' => 'Create Key'
				),
				array(
						'link' => 'security/edit',
						'title' => 'Edit Key'
				)
		);		
		
		
	}
	
	public static function hasAccess()
	{
		
		return array(
				array(
						'link' => 'episodes',
						'title' => 'Episodes'
				),
				array(
						'link' => 'subscriptions',
						'title' => 'Subscriptions'
				),				
				array(
						'link' => 'subscriptions/create/feed',
						'title' => ' - Enter Feed URL'
				),
				array(
						'link' => 'subscriptions/create/youtube',
						'title' => ' - Enter YouTube ChannelID'
				),
				array(
						'link' => 'search/itunes',
						'title' => ' - Search iTunes'
				),

				array(
						'link' => 'search/youtube',
						'title' => ' - Search YouTube'
				),
				array(
						'link' => 'dropbox',
						'title' => 'Dropbox'
				),
    		    array(
    		        'link' => 'clients',
    		        'title' => 'Clients'
    		    ),		  
				array(
						'link' => 'security/edit',
						'title' => 'Change Key'
				),
				array(
						'title' => 'Logout',
						'link' => 'security/logout',
				),

		
		);		
	
	}	
	
	
	
}


?>