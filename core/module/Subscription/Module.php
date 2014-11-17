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


use Zend\Mvc\MvcEvent;

use Subscription\Service\SubscriptionService;
use Subscription\Service\EpisodeService;
use Subscription\Service\FeedService;
use Subscription\Service\YoutubeService;


class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $sm = $e->getApplication()->getServiceManager();
    }
    
    
    
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }
    
    public function getServiceConfig()
    {
        return array(
            'abstract_factories' => array(),
            'aliases' => array(),
            'factories' => array(
                'subscription_service' => function($sm){
                    $om = $sm->get('Doctrine\ORM\EntityManager');
                    return new SubscriptionService($sm, $om);
                },
                'episode_service' => function($sm){
                    $om = $sm->get('Doctrine\ORM\EntityManager');
                    return new EpisodeService($sm, $om);
                },
                'feed_service' => function(){
                    return new FeedService();
                },                
                'youtube_service' => function($sm){
                    $om = $sm->get('Doctrine\ORM\EntityManager');
                    return new YoutubeService($sm, $om);
                }            
            )
        );
    }

    
}