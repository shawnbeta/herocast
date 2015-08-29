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
      //'build/sandbox/assets/js/contrib/*.js',


      'build/sandbox/assets/js/contrib/angular.js',
      'build/sandbox/assets/js/contrib/angular-mocks.js',
      'build/sandbox/assets/js/contrib/angular-route.js',
      'build/sandbox/assets/js/contrib/angular-sanitize.js',
      'build/sandbox/assets/js/contrib/angular-touch.js',
      'build/sandbox/assets/js/contrib/jquery.js',
      'build/sandbox/assets/js/contrib/underscore.js',
      //
      'build/sandbox/assets/js/scripts/modules/*.js',
      'build/sandbox/assets/js/scripts/modules/*.js',
      'build/sandbox/assets/js/scripts/modules/**/**/*.js',
      'build/sandbox/assets/js/scripts/modules/**/test/**/*.js'
      //'build/sandbox/assets/js/scripts/modules/app.js',
      //'build/sandbox/assets/js/scripts/modules/routes.js',
      //
      //
      //// Media Services
      //'build/sandbox/assets/js/scripts/modules/media/services/EpisodeService.js',
      //'build/sandbox/assets/js/scripts/modules/media/services/MediaService.js',
      //'build/sandbox/assets/js/scripts/modules/media/services/SearchService.js',
      //'build/sandbox/assets/js/scripts/modules/media/services/SubscriptionService.js',
      //
      //  // Player Service
      //'build/sandbox/assets/js/scripts/modules/player/services/PlayerService.js',
      //
      //// Utility Services
      //'build/sandbox/assets/js/scripts/modules/utility/services/DepartureService.js',
      //'build/sandbox/assets/js/scripts/modules/utility/services/HelperService.js',
      //'build/sandbox/assets/js/scripts/modules/utility/services/PersistenceService.js',
      //
      //  // Vendors Services
      //'build/sandbox/assets/js/scripts/modules/vendors/services/UnderscoreService.js'
    ],


    // list of files to exclude
    exclude: [
      //'build/sandbox/assets/js/contrib/angular-mocks.js',
      //'build/sandbox/assets/js/contrib/angular-route.js',
      //'build/sandbox/assets/js/contrib/angular-sanitize.js',
      //'build/sandbox/assets/js/contrib/angular-touch.js'

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
