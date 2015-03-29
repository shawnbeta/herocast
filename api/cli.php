<?php

require_once 'vendor/autoload.php';

use modules\app\commands\GreetCommand;
use Symfony\Component\Console\Application;

$application = new Application();
$application->add(new GreetCommand);
$application->run();
