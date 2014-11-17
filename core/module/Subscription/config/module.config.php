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

namespace Subscription;
return array(
    'controllers' => array(
        'invokables' => array(
            'Subscription\Controller\Subscription' 	=> 'Subscription\Controller\SubscriptionController',
            'Subscription\Controller\Episode' 	=> 'Subscription\Controller\EpisodeController',
            'Subscription\Controller\Search' 	=> 'Subscription\Controller\SearchController',
        ),
    ),
 // The following section is new and should be added to your file
     'router' => array(
         'routes' => array(
         		
             'subscription' => array(
                 'type'    => 'segment',
                 'options' => array(
                     'route'    => '/subscriptions[/][:action][/:id][/:option]',
                     'constraints' => array(
                  			'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                     		'id'     => '[a-zA-Z0-9_-]*',
               					'option' => '[a-zA-Z0-9_-]*',
                     ),
                     'defaults' => array(
                         'controller' => 'Subscription\Controller\Subscription',
                         'action'     => 'get',
                     ),
                 ),
             ), 
         		'episode' => array(
         				'type'    => 'segment',
         				'options' => array(
         						'route'    => '/episodes[/][:action][/:id][/:option]',
         						'constraints' => array(
         								'action' => '[a-zA-Z0-9_-]*',
         								'id'     => '[a-zA-Z0-9_-]*',
         						),
         						'defaults' => array(
         								'controller' => 'Subscription\Controller\Episode',
         								'action'     => 'page',
         						),
         				),
         		),
         		
         		// Search routes
         		'search' => array(
         				'type'    => 'segment',
         				'options' => array(
         						'route'    => '/search[/][:action][/:keyword][/:filter]',
         						'constraints' => array(
         								'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
         								'keyword' => '[a-zA-Z][a-zA-Z0-9_-]*',
         								'filter' => '[a-zA-Z][a-zA-Z0-9_-]*',
         						),
         						'defaults' => array(
         								'controller' 	=> 'Subscription\Controller\Search',
         								//'action' 			=> 'itunes',
         						),
         				),
         		),

         ),
     ),
    'view_manager' => array(
        'template_path_stack' => array(
            'subscription' => __DIR__ . '/../view',
        ),
    ),
	
	// Work with Doctrine
    'doctrine' => array(
        'driver' => array(
            __NAMESPACE__ . '_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(
                    __DIR__ . '/../src/' . __NAMESPACE__ . '/Entity',
                    __DIR__ . '/../src/' . __NAMESPACE__ . '/Controller',
                    __DIR__ . '/../src/' . __NAMESPACE__ . '/Repository',
                    __DIR__ . '/../src/' . __NAMESPACE__ . '/Service',
                    
                )
            ),
            'orm_default' => array(
                'drivers' => array(
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver',
                    __NAMESPACE__ . '\Controller' => __NAMESPACE__ . '_driver',
                    __NAMESPACE__ . '\Repository' => __NAMESPACE__ . '_driver',
                    __NAMESPACE__ . '\Service' => __NAMESPACE__ . '_driver',
                    


                )
            )
        )
    )
		
		
		
		
);