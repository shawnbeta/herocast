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

class YoutubeServiceTest extends \PHPUnit_Framework_TestCase
{
    
    protected $service_manager;
    protected $youtube_service;
    protected $src;
    
    protected function setUp()
    {
        $this->service_manager = Bootstrap::getServiceManager();
        $this->youtube_service = $this->service_manager->get('youtube_service');
        $this->src = SecurityService::getConfig()['test_youtube_channel'];
    }
    
    public function testGetYoutubeKey()
    {
        $youtube_key = $this->youtube_service->getYoutubeKey();
        $this->assertNotEmpty($youtube_key);
       
    }
    

    public function testGetChannelData()
    {
        $channel_data = $this->youtube_service->getChannelData($this->src);
        $this->assertGreaterThanOrEqual(1, count($channel_data));
        $this->assertTrue(is_object($channel_data));
        return $channel_data;
    }
    
    /**
     * @depends testGetChannelData
     */
    public function testGetEpisodeData(\stdClass $channel_data)
    {
        $this->assertGreaterThanOrEqual(1, count($channel_data));
        $this->assertTrue(is_object($channel_data));
    }
    
    /**
     * @depends testGetChannelData
     */
    public function testSetYoutubeFields(\stdClass $channel_data)
    {
        $obj = $this->youtube_service->setYoutubeFields($channel_data, true);
        $this->assertTrue(is_object($obj));
        $this->assertNotEmpty($obj->__get('title'));
    }
    
    
}