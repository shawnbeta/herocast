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

namespace Utility;

return array(
    'controllers' => array(
        'invokables' => array(
            'Utility\Controller\File' 	=> 'Utility\Controller\FileController',
        ),
    ),
 // The following section is new and should be added to your file
     'router' => array(
         'routes' => array(
             'test' => array(
                 'type'    => 'segment',
                 'options' => array(
                     'route'    => '/utility[/][:action][/:id]',
                     'constraints' => array(
                         'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                         'id'     => '[0-9]+',
                     ),
                     'defaults' => array(
                         'controller' => 'Utility\Controller\File',
                         'action'     => 'getInstructions',
                     ),
                 ),
             ),
 		
         		
         		
         ),
     ),
    
    'view_manager' => array(
        'template_path_stack' => array(
            'media' => __DIR__ . '/../view',
        ),
    ),
	
	// Work with Doctrine
    'doctrine' => array(
        'driver' => array(
            __NAMESPACE__ . '_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/' . __NAMESPACE__ . '/Entity')
            ),
            'orm_default' => array(
                'drivers' => array(
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver'
                )
            )
        )
    )
		
		
		
		
);