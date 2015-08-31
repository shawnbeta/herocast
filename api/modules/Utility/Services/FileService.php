<?php
namespace ShawnBeta\Utility\Services;


use ShawnBeta\App\Services\BaseService;

class FileService extends BaseService{

    public static function copyToServerOLD($remote_file, $file_type, $machine_name)
    {


        $file_name = self::getFileName($remote_file);

        
        $paths = self::getSettings()['parameters']['paths'];

        
        $local_dir =  $paths['file_root'] . '/' . $file_type . '/' . $machine_name . '/';
        $local_web_file = $paths['web_root'] . '/' . $file_type . '/' . $machine_name . $file_name;

        if (!file_exists($local_dir))
            mkdir($local_dir, 0777, true);

        $local_file = $local_dir . $file_name;
        $file = fopen ($local_file, 'w+');
        $ch = curl_init($remote_file);

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
        return $local_web_file;
    }
    
    private static function getLocation($paths, $file){
    	$rsp['file_path'] =
    		$paths['file_root'] . '/' . $file['type'] . '/' . $file['machine_name'] . '/';
    	$rsp['web_path'] = 
    		$paths['web_root'] . '/' . $file['type'] . '/' . $file['machine_name'] . '/' . $file['name'];
    	if (!file_exists($rsp['file_path'])){
		  $oldmask = umask(0);
		  mkdir($rsp['file_path'], 0777, true);
		  umask($oldmask);
		}

    	$rsp['file_path'] = $rsp['file_path'] . $file['name'];
    	return $rsp;    	
    }

    private static function getFileName($src)
    {
        $ext = '.' . pathinfo($src, PATHINFO_EXTENSION);
        $file_name = pathinfo($src, PATHINFO_FILENAME);
        if(!$file_name) return;
        return $file_name . $ext;
    }

		public static function copyToServer1($remoteFile, $fileType, $machineName)
		{
			$fileName = self::getFileName($remoteFile);
			$paths = self::getSettings()['parameters']['paths'];
			$localDir =  $paths['file_root'] . '/' . $fileType . '/' . $machineName . '/';
			$localWebFile = $paths['web_root'] . '/' . $fileType . '/' . $machineName . '/' . $fileName;
			if (!file_exists($localDir))
				mkdir($localDir, 0777, true);
			$localFile = $localDir . $fileName;
			file_put_contents($localFile, fopen($remoteFile, 'r'));
			return $localWebFile;
		}
		
		private static function makeCopy($src, $location)
		{
			
			$file = fopen ($location, 'w+');
			
			$ch = curl_init($src);
			
			//Set the location of the file
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, false );
			curl_setopt( $ch, CURLOPT_BINARYTRANSFER, true );
			curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
			
			# increase timeout to download big file
			curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 5000 );
			curl_setopt( $ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:7.0.1) Gecko/20100101 Firefox/7.0.1');
			
			# write data to local file
			curl_setopt( $ch, CURLOPT_FILE, $file);
			
			curl_exec($ch);
			curl_close($ch);
			
			fclose( $file );

		  $paths = self::getSettings()['parameters']['paths'];
		  $oldmask = umask(0);

		  chmod($location, 0777);
		  umask($oldmask);

			
		}

		public static function copyToServer($src, $fileType, $machineName){
			$file = array('src' => $src, 'type' =>$fileType, 'machine_name' => $machineName);
			$file['name'] = self::getFileName($src);
			
			$paths = self::getSettings()['parameters']['paths'];
			$rsp = self::getLocation($paths, $file);
			//var_dump($rsp);
			$fileName = $rsp['file_path'];
			//CurlTool::downloadFile($src, $fileName);	
			self::makeCopy($src, $fileName);
			return $rsp['web_path'];
			
		}
		
		public static function getImage($parent)
		{
			/*if($image = $parent->get_enclosure()->get_thumbnail()){
			 return $image;
			 }*/
			// Try to see if there is an image in the html of the description
			$html = new \simple_html_dom();
			$html->load($parent->get_description());
		
			// Just get one image for now
			$images = $html->find('img');
		
			// Check to see if an image exist in the description
			if($images != null && $images[0]->src != null){
				$width = (int)$images[0]->width;
				// If it does exist make sure the size is larger then 20 px or ignore the file.
				if($width > 20)
					return  $images[0]->src;
			}
		}
};