<?php
/**
 * Created by PhpStorm.
 * User: shawn
 * Date: 2/9/15
 * Time: 9:16 PM
 */

namespace ShawnBeta\Utility\Services;


class FileService {

    public static function copyToServer($remote_file, $file_type, $machine_name)
    {

        //echo "SBImage2: ";
        //print_r($remote_file);

        $file_name = self::getFileName($remote_file);

        //var_dump($remote_file);

        $local_dir = FILE_ROOT . '/' . $file_type . '/' . $machine_name . '/';
        $local_web_file = WEB_ROOT . '/' . $file_type . '/' . $machine_name . '/' . $file_name;

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

    public static function getFileName($src)
    {
        $ext = '.' . pathinfo($src, PATHINFO_EXTENSION);
        $file_name = pathinfo($src, PATHINFO_FILENAME);
        if(!$file_name) return;
        return $file_name . $ext;
    }
}