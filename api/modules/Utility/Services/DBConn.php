<?php

namespace ShawnBeta\Utility\Services;

use Symfony\Component\Yaml\Parser;
use ShawnBeta\App\Services\BaseService;

class DBConn extends \PDO {
	private $engine;
	private $host;
	private $database;
	private $user;
	private $password;
	public function __construct() {
		$db = BaseService::pubGetDatabase();
		$this->engine = $db['engine'];
		$this->host = $db['host'];
		$this->database = $db['name'];
		$this->user = $db['user'];
		$this->password = $db['password'];
		$dns = $this->engine . ':dbname=' . $this->database . ";host=" . $this->host;
		parent::__construct ( $dns, $this->user, $this->password );
		$this->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);


	}
	
}