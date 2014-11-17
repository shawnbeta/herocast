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
use Subscription\Entity\SubscriptionEntity;
use Security\Service\SecurityService;


class FeedServiceTest extends \PHPUnit_Framework_TestCase
{
    
    protected $service_manager;
    protected $feed_service;
    protected $src;
    
    protected function setUp()
    {
        $this->service_manager = Bootstrap::getServiceManager();
        $this->feed_service = $this->service_manager->get('feed_service');
        $this->src = SecurityService::getConfig()['test_feed_url'];
    }
    
    public function testGetFeedData()
    {
        $feed_data = $this->feed_service->getFeedData($this->src);
        $this->assertTrue(!empty($feed_data->get_title()));
        $this->assertGreaterThanOrEqual(1, count($feed_data));
        
        return $feed_data;
    }


    public function testGetZendData()
    {
        $rsp = $this->feed_service->getZendData($this->src);
        $this->assertNotEmpty($rsp->getTitle());
        $this->assertGreaterThanOrEqual(1, count($rsp));
    }
    
    public function testGetSPData()
    {
        $rsp = $this->feed_service->getSPData($this->src);
        $this->assertNotEmpty($rsp->get_title());
        $this->assertGreaterThanOrEqual(1, count($rsp));
    }
    
    /**
     * @depends testGetFeedData
     */
    public function testSetFields($feed_data)
    {
        $rsp = $this->feed_service->setFields($feed_data, $this->src, 'test');
        $this->assertNotEmpty($rsp->__get('title'));
    }
    
    public function testSubscriptionFallback()
    {
        $rsp = $this->feed_service->subscriptionFallback(new SubscriptionEntity());
        $this->assertNotEmpty($rsp->__get('title'));
               
    
    }    
}

?>