<?php
namespace SubscriptionTest;

use Zend\Mvc;
use Zend\ServiceManager\ServiceManager;
use Zend\Mvc\Service\ServiceManagerConfig;

class bootstrap
{
    static $service_manager;

    static function go()
    {
        // Make everything relative to the root
        chdir(dirname(__DIR__));

        // Setup autoloading
        require_once( __DIR__ . '/../init_autoloader.php' );

        // Run application
        $config = require('config/application.config.php');
        \Zend\Mvc\Application::init($config);

        $service_manager = new ServiceManager(new ServiceManagerConfig());
        $service_manager->setService('ApplicationConfig', $config);
        $service_manager->get('ModuleManager')->loadModules();

        self::$service_manager = $service_manager;
    }

    static public function getServiceManager()
    {
        return self::$service_manager;
    }
}

bootstrap::go();
