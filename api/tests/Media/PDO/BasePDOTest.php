<?php
/**
 * Created by PhpStorm.
 * User: shawn
 * Date: 1/20/15
 * Time: 1:48 PM
 */

namespace DAO;


class BaseDataMap extends \PDO{


    private $engine;
    private $host;
    private $database;
    private $user;
    private $pass;

    public function __construct(){
    	$dbVals = yaml_parse(file_get_contents('config/db.yaml'));
    	var_dump($dbVals);
        $this->engine = 'mysql';
        $this->host = 'localhost';
        $this->database = '';
        $this->user = 'root';
        $this->pass = '';
        $dns = $this->engine.':dbname='.$this->database.";host=".$this->host;
        parent::__construct( $dns, $this->user, $this->pass );
    }



}