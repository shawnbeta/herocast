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


namespace Utility\Service;

use Utility;
use Imagick;

use Dropbox\AppInfo;
use Dropbox\WebAuthNoRedirect;
use Dropbox\Client as DBXC;
use Dropbox\WriteMode;

use Security\Service\SecurityService;

require_once 'vendor/zendmedia/Zend/Media/Id3v2.php';

class FileService {
    
    public function __construct($sm, $om)
    {
        $this->sm = $sm;
        $this->om = $om;
    }
    
    public static function getInstruction()
    {
        $dbx_data['key'] = SecurityService::getConfig()['dbx_key'];
        $dbx_data['secret'] = SecurityService::getConfig()['dbx_secret'];
        
        $appInfo =  AppInfo::loadFromJson($dbx_data);
        $webAuth = new WebAuthNoRedirect($appInfo, "PHP-Example/1.0");
        $authorizeUrl = $webAuth->start();
        
        $instructions = "Step 1. <a href='" . $authorizeUrl . "' target='_blank'>Go to Dropbox</a><br/>";
        $instructions .= "Step 2. Click \"Allow\" (you might have to log in first).<br/>";
        $instructions .= "Step 3. Copy the authorization code.<br/>";
        $instructions .= "Step 4. Paste it here.<br/>";
        
        return array(
            'success' => true,
            'instructions' => $instructions
        );
    }
	
    public static function authorize()
    {

        // Get token from post
        $request = $this->getRequest();
        $token = $request->getPost('token');
        
        // Get dropbox information from configuation file.
        $dbx_data['key']    = SecurityService::getConfig()['dbx_key'];
        $dbx_data['secret'] = SecurityService::getConfig()['dbx_secret'];
        
        // Get DBX classes
        $appInfo =  AppInfo::loadFromJson($dbx_data);
        $webAuth = new WebAuthNoRedirect($appInfo, "PHP-Example/1.0");
         
        // Get the access Token from the API
        list($accessToken, $dropboxUserId) = $webAuth->finish($token);
        
        // Create the new token
        $this->getServiceLocator()
        ->get('token_service')->setDBXToken($accessToken);
         
        $rsp = array(
            'success' => true,
        );
    }
    
	public static function deleteFiles($images)
	{

		// loop through the file array and delete 
		// all attached files.
		foreach($images as $file){
			unlink($file); 
		}
	}
	
	public static function getPodcastFile($episode, $subscription_title)
	{
		
		$src = $episode->__get('src');
		// Get the filename
		$filename = self::getFileName($src);
				
		// Get the file information
		$rqst = array(
			'parent_title' 	=> $subscription_title,
			'type' 					=> 'media',
			'src' 					=> $src,
			'filename'			=> $filename
		);
		
		// Get the location
		$location = self::getLocation($rqst);
			
		// Move the podcast content to the server.
		file_put_contents($location, fopen($src, 'r'));
		
		
		// Try to get embedded art
		self::getMediaImage($location, $episode);

		return;
		
	}
	
	public static function getMediaImage($location, $episode)
	{
		// PHP Reader: https://code.google.com/p/php-reader/
		// Now get and move the image from the file if any
		try {
			$id3 = new  \Zend_Media_Id3v2($location);
		} catch (\Exception $e) {
			//print 'no';
		}
		
		if(isset($id3)){
			
			try{
			    $type = explode("/", $id3->apic->mimeType, 2);
			    
			    $filename = $episode->__get('id') . $type[1];
			
			    $rqst = array(
			        'parent_title' 	=> $episode->__get('title'),
			        'type' 					=> 'episode-art',
			        'filename'			=> $filename
			    );
			    
			    // Get the cover-art information.
			    $ca_location = self::getLocation($rqst);
			    
			    if(($handle = fopen($ca_location, "wb"))!== false){
			        if (fwrite($handle, $id3->apic->imageData,
			            $id3->apic->imageSize) != $id3->apic->imageSize);
			        fclose($handle);
			
			        // Now update the episode with the new image location
			        $episode->__set('image', $filename);
			
			    };
			}catch(\Exception $e){
			    $err = "Something went wrong with file import.\n";
			    $err .= $e;
			    error_log($e, 3, 'logs/file_log');
			}			
			
			return;
			
		}
		
		
	} 
	
	public static function getSubscriptionCoverArt($title, $src){
		
		// Get the filename
		$filename = self::getFileName($src);
		
		// Get the file information
		$rqst = array(
				'parent_title' 	=> $title,
				'type' 					=> 'cover-art',
				'src' 					=> $src,
				'filename'			=> $filename
		);
		
		// Get file location
		$location = self::getLocation($rqst);
		
		// Take care of only the file copy/write to localhost
		self::copyToServer($rqst['src'], $location);

		// Do imagick scale to exact size
		// I'm ignoring small thumbnails now
		// and will implement yahoo/google search
		// when I add the image changer later on.
		
		try {
			$imagick = new \Imagick($location);
			$imagick->thumbnailimage(285, 0);
			$imagick->writeimage($location);
		} catch (\ImagickException $e) {
			$filename = "failed";
		}

		return $filename;
	}
	
	public static function copyToServer($src, $location){
		
		$file = fopen ($location, 'w+');
		
		$ch = curl_init($src);
		
		//Set the location of the file
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, false );
		curl_setopt( $ch, CURLOPT_BINARYTRANSFER, true );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );		

		# increase timeout to download big file
		curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 50 );
		curl_setopt( $ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:7.0.1) Gecko/20100101 Firefox/7.0.1');
		
		# write data to local file
		curl_setopt( $ch, CURLOPT_FILE, $file);
		
		curl_exec($ch);
		curl_close($ch);
		
		fclose( $file );	
	}
	
	public static function getLocation($rqst)
	{
    
    // Get configuration object
    $security_service = new SecurityService();
    $config = $security_service->getConfig();
    
    
    
		$file_path = $config['file_root'] . $rqst['type'] . '/' . $rqst['parent_title'] . '/';
		if (!file_exists($file_path))	
			mkdir($file_path, 0777, true);
		return $file_path . $rqst['filename'];
	}

	public static function getFileName($src)
	{
		$ext = '.' . pathinfo($src, PATHINFO_EXTENSION);
		$file_name = pathinfo($src, PATHINFO_FILENAME);
		if(!$file_name) return;
		return $file_name . $ext;
	}
	
	public function copyToDBX($id)
	{

	    $episode =  $this->om->getRepository('Subscription\Entity\EpisodeEntity')
	    ->findOneBy(array('id' => $id));	    
	    
	    $token =  $this->om->getRepository('Security\Entity\TokenEntity')
	    ->findOneBy(array('name' => 'dbx_token'));	    
	   		
		$src = $episode->__get('src');
	
		// Build a valid filename
		$ext = pathinfo($src, PATHINFO_EXTENSION);
		$file_name = pathinfo($src, PATHINFO_FILENAME);
		$file = "/" . $episode->__get('subscription')->__get('title')  . "/". $file_name . '.' . $ext;

		$dbx_client = new DBXC($token->__get('value'), "PHP-Example/1.0");
	
		$f = fopen($src, "rb");
		$result = $dbx_client->uploadFile($file , WriteMode::add(), $f);
	
		fclose($f);
	
		if($result) return true;
	}
	
}

?>