<?php
error_reporting(E_ALL);

print 'copy test';

$remoteFile = 'http://feedproxy.google.com/~r/starwarsreport_podcast/~5/5sOuIRU3rI0/starwarsreport160.mp3';

$fileName = self::getFileName($remoteFile);


$localDir =  'files/test';

if (!file_exists($localDir))
	mkdir($localDir, 0777, true);

$localFile = $localDir . $fileName;
$file = fopen ($localFile, 'w+');
$ch = curl_init($fileName);

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