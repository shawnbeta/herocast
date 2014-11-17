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

namespace SubscriptionTest\Service;

use SubscriptionTest\Bootstrap;
use PHPUnit_Framework_TestCase;

use XMLReader;
use Security\Service\SecurityService;


class EpisodeServiceTest extends \PHPUnit_Framework_TestCase
{
    
    protected $service_manager;
    protected $episode_service;
    protected $src;
    public $subscription;
    public $episode;
    
    protected function setUp()
    {
        $this->service_manager = Bootstrap::getServiceManager();
        $this->episode_service = $this->service_manager->get('episode_service');
        $this->src = SecurityService::getConfig()['test_feed_url'];
        $this->subscription = $this->dummySubscription();
        $this->episode = $this->dummyEpisode();
    }
    
    public function dummySubscription()
    {
        $subscription = new \Subscription\Entity\SubscriptionEntity();
        $subscription->title = 'Subscription Title';
        $subscription->description = 'Subscription Description';
        $subscription->url = 'http://frizzmop.com';
        $subscription->download = true;
        $subscription->type = 'audio';
        $subscription->create_date = new \DateTime("now");
        $subscription->modified_date = new \DateTime("now");   
        return $subscription;     

    }
    
    public function dummyEpisode()
    {
        // Create dummy entity
        $episode = new \Subscription\Entity\EpisodeEntity();
        
        $episode->id = 123;
        $episode->title = 'Test Episode';
        $episode->overview = 'jskafjdsl';
        $episode->src = 'http://frizzmop.com';
        $episode->pub_date = new \DateTime("now");
        $episode->create_date = new \DateTime("now");
        $episode->subscription = $this->subscription;
        
        return $episode;
    }
    
    
    public function testGetAll()
    {
        
        $mock_episode_repository = $this->getMockBuilder('Subscription\Repository\EpisodeRepository')
            ->disableOriginalConstructor()
            ->getMock();
        
        $mock_episode_repository->expects($this->once())
            ->method('findAll')
            ->will( $this->returnValue($this->episode) );

        // Mock the entity manager
        $emMock = $this->getMock('EntityManager',
            array('getRepository'), array(), '', false);
        
        $emMock->expects( $this->once() )
            ->method( 'getRepository' )
            ->will( $this->returnValue( $mock_episode_repository ) );
            
        $mock_episode_service = new \Subscription\Service\EpisodeService($this->service_manager, $emMock);

        $rsp = $mock_episode_service->getAll();

        $this->assertTrue(is_object($rsp));
        $this->assertTrue($rsp->__get('title') === 'Test Episode');
               
        return $rsp;
    }
    

    public function testGetOne()
    {
        
        $mock_episode_repository = $this->getMockBuilder('Subscription\Repository\EpisodeRepository')
            ->disableOriginalConstructor()
            ->getMock();
        
        $mock_episode_repository->expects($this->once())
            ->method('find')
            ->will( $this->returnValue($this->episode) );
        
        // Mock the entity manager
        $emMock = $this->getMock('EntityManager',
            array('getRepository'), array(), '', false);
        
        $emMock->expects( $this->once() )
            ->method( 'getRepository' )
            ->will( $this->returnValue( $mock_episode_repository ) );
        
        $mock_episode_service = new \Subscription\Service\EpisodeService($this->service_manager, $emMock);
        
        $rsp = $mock_episode_service->getOne($this->episode->__get('id'));
        
        $this->assertTrue(is_object($rsp));
        $this->assertTrue($rsp->__get('title') === 'Test Episode');

    }

    
    
}