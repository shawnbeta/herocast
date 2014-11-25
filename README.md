HeroCast
========

<h2>Overview</h2>
<p>I'm someone who uses a variety of devices throughout the day. These include: Ubuntu desktop, Macbook laptop, android phone/tablet and windows phone. I love listening to podcasts and decided to write an application that enables me to listen to and manage my all my podcasts.</p>

<h3>Zend2 Framework</h3>
<p>The apps backend is built on top of the Zend2. I started with Syfony2 but switched over to Zend because the structures is a bit less cumbersome, the documentation is outstanding and it has built in tools like feeds that help ease the development process. The framework helps keep the code organized, making things easier to update and for others to understand.</p>

<h3>The Front End</h3>
<p>The front end is delivered by Angular and a little jQuery. AJAX and local storage helps limit server request and gives the app added snappiness! Responses are sent back in pure JSON.</p>

<h3>Single User Philosophy</h3>
<p>The app is designed to allow a single user to subscribe and manage their podcast library. Since this is a web application the script must live on a server. In order to stop any Joe Shmoe from randomly accessing your app I setup an access key function. By doing it this way you create one access key and use it to access your app through the browser. Once you've verified your access key it is saved in local storage and used to automatically log you in upon subsequent visits.</p>

<h3>File Management</h3>
<p>Automatically or manually copy files to Dropbox or your server. Download files through the browser and play with your favorite media player. Scheduling set using a cronjob.</p>


<h3>BETA - Media Player</h3>
<p>Thanks to the folks at jplayer(http://www.jplayer.org/) for putting together an awesome open source media player. Its HTML5 friendly with a flash fallback. While not perfect, it does work most of the time (at least on desktop). It does lag when it comes to resuming playback from drop off point (files take a while to load) but all in all its a pretty darn good player.</p>

<h3>YouTube Subscriptions</h3>
<p>Not just for podcasts. Keep up with your favorite Youtube episodes too. I even setup a little filter so you can limit the results to keywords found in the episode title.</p>

<h3>Search iTunes or YouTube</h3>
<p>Add your Youtube key to enable YouTube search. ITunes is enabled by default.</p>

<h3>NOTE</h3>
<p>The javascript doesn't work properly in all cases. I'm swithing from Angular to Dart/Polymer on this project. It will most likely be Feb 2015 before the new front end is available (I just started with Dart yesterday[11/23/2014]). I'll also be cleaning up the theme at the same time. Enjoy the code! Questions/comments hit me up shawnbeta@outlook.com.</p>

<h2>Get Started</h2>
<ol>
<li>Move all files to your PHP 5.3+ server.</li>

<li>Copy: <b>core/config/autoload/EDITME.doctrine.local.php</b> to <b>core/config/autoload/doctrine.local.php</b> </li>

<li>Copy: <b>core/config/EDITME.settings.json</b> <b>to core/config/autoload/settings.json</li>

<li>Edit: <b>core/config/autoload/doctrine.local.php</b>  adding your database credentials.
	- Modify: orm_default params: host, port, user, password, dbname</li>

<li>Edit: <b>core/config/autoload/settings.json</b> adding settings were needed/required.</li>

</ol>


<h3>Settings for config:</h3>

src_root : The absolute path to your download folder
file_root : The location of the directory on your server.
delete_after : (integer) how many weeks to keep episodes.
change_key : (boolean) true or false to change your access key.
change_dbx : (boolean) true/false to change dropbox key.
dbx_secret : (string) The secret to integrate your dropbox account.
test_youtube_channel : (string) Channel id to run unit test against.
test_feed_url : (string) XML to run phpunit test against.

