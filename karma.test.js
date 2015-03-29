// Karma configuration
// Generated on Sat Mar 07 2015 21:15:47 GMT-0700 (MST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
   	  'bower_components/angular/angular.js',
   	  'bower_components/angular-mocks/angular-mocks.js',   	  	
      'bower_components/angular-route/angular-route.js',   
      'bower_components/angular-sanitize/angular-sanitize.js',   
      'bower_components/underscore/underscore.js',
      /*'js/modules/app/controllers/AppController.js',
      'js/modules/app/controllers/SettingsCtrl.js',      
      'js/modules/app/app.js',
      'js/modules/app/routes.js',
      'js/modules/media/controllers/EpisodeCtrl.js',
      'js/modules/media/controllers/SubscriptionCtrl.js',
      
      'js/modules/media/test/controllers/SubscriptionTest.js',*/
   	  	  	
   	  	  	
      'js/modules/app/app.js',
      //'js/modules/app/demo.js',
      'js/modules/app/routes.js',
      'js/modules/**/**/*.js',
      'js/modules/**/test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    'js/modules/app/demo.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
