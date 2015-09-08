module.exports = function (grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    // Project configuration.
    grunt.initConfig({

        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'backup',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },

        karma: {
            unit: {
                configFile: 'karma.test.js',
                //runnerPort: 9876,
                //singleRun: true,
                //browsers: ['chrome']
            }
        },

        clean: {
            assets: [ 'themes/portland/assets' ],
            dev: [ 'build/sandbox'],
            staging: [ 'build/testing'],
            temp: ['build/temp']
        },

        mustache_render: {


            dev: {
                options: {
                    directory: 'mustache_templates'
                },
                files: [
                    {
                        data: 'data/dev.json',
                        template: 'mustache_templates/routes.mustache',
                        dest: 'scripts/modules/routes.js'
                    },
                    {
                        data: 'data/dev.json',
                        template: 'mustache_templates/app/main.mustache',
                        dest: 'build/sandbox/index.html'
                    },
                    {
                        data: 'data/dev.json',
                        template: 'mustache_templates/app/settings.mustache',
                        dest: 'scripts/modules/app/templates/settings.html'
                    },
                    {
                        data: 'data/subscriptions.json',
                        template: 'mustache_templates/media/subscriptions.mustache',
                        dest: 'scripts/modules/media/templates/subscriptions.html'
                    },
                    {
                        data: 'data/episodes.json',
                        template: 'mustache_templates/media/episodes.mustache',
                        dest: 'scripts/modules/media/templates/episodes.html'
                    },
                    {
                        data: 'data/dev.json',
                        template: 'mustache_templates/app/about.mustache',
                        dest: 'scripts/modules/app/templates/about.html'
                    },
                    {
                        data: 'data/add.json',
                        template: 'mustache_templates/media/add.mustache',
                        dest: 'scripts/modules/media/templates/add.html'
                    }
                ]
            },
            staging: {
                options: {
                    directory: 'mustache_templates'
                },
                files: [
                    {
                        data: 'data/staging.json',
                        template: 'mustache_templates/routes.mustache',
                        dest: 'build/temp/routes.js'
                    },
                    {
                        data: 'data/staging.json',
                        template: 'mustache_templates/app/main.mustache',
                        dest: 'build/testing/index.html'
                    },
                    {
                        data: 'data/staging.json',
                        template: 'mustache_templates/app/settings.mustache',
                        dest: 'build/testing/assets/templates/settings.html'
                    },
                    {
                        data: 'data/subscriptions.json',
                        template: 'mustache_templates/media/subscriptions.mustache',
                        dest: 'build/testing/assets/templates/subscriptions.html'
                    },
                    {
                        data: 'data/episodes.json',
                        template: 'mustache_templates/media/episodes.mustache',
                        dest: 'build/testing/assets/templates/episodes.html'
                    },
                    {
                        data: 'data/dev.json',
                        template: 'mustache_templates/app/about.mustache',
                        dest: 'build/testing/assets/templates/about.html'
                    },
                    {
                        data: 'data/add.json',
                        template: 'mustache_templates/media/add.mustache',
                        dest: 'build/testing/assets/templates/add.html'
                    }
                ]
            }
        },

        less: {

            dev: {
                options: {
                    strictMath: true,
                    outputSourceFiles: true
                },
                files: {
                    //'build/sandbox/assets/css/bootstrap.css': 'bower_components/bootstrap/less/bootstrap.less',
                    'build/sandbox/assets/css/contrib/bootstrap-lite.css': 'less/contrib/bootstrap-lite.less',
                    'build/sandbox/assets/css/libs/media/main.css': 'less/media/main.less',
                    'build/sandbox/assets/css/libs/media/grid.css': 'less/media/grid.less',
                    'build/sandbox/assets/css/libs/media/list.css': 'less/media/list.less',
                    'build/sandbox/assets/css/libs/footer.css': 'less/footer.less',
                    'build/sandbox/assets/css/libs/overlay.css': 'less/overlay.less',
                    'build/sandbox/assets/css/libs/globals.css': 'less/globals.less',
                    'build/sandbox/assets/css/libs/main.css': 'less/main.less',
                    'build/sandbox/assets/css/libs/navBar.css': 'less/navBar.less',
                    'build/sandbox/assets/css/libs/player.css': 'less/player.less',
                    'build/sandbox/assets/css/libs/variables.css': 'less/variables.less'
                }
            },
            staging: {
                options: {
                    strictMath: true,
                    outputSourceFiles: true
                },
                files: {
                    'build/temp/styles.css' : 'less/styles.less'
                }
            }
        },

        copy: {

            dev: {
                files : [
                    {

                        expand: true,
                        flatten: false,
                        dot: true,
                        src: 'api/**',
                        dest: 'build/sandbox/'
                    },
                    {
                        expand: true,
                        flatten: false,
                        src: 'assets/**',
                        dest: 'build/sandbox/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/angular/angular.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/angular-mocks/angular-mocks.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/angular-route/angular-route.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/angular-sanitize/angular-sanitize.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/angular-touch/angular-touch.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/angular-truncate/src/truncate.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/jquery/dist/jquery.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/underscore/underscore.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: false,
                        src: 'scripts/modules/**',
                        dest: 'build/sandbox/assets/js/'
                    }
                ]
            },
            staging: {
                files : [
                    {

                        expand: true,
                        flatten: false,
                        dot: true,
                        src: 'api/**',
                        dest: 'build/testing/'
                    },
                    {
                        expand: true,
                        flatten: false,
                        src: 'assets/**',
                        dest: 'build/testing/'
                    }
                ]
            }
        },

        concat: {

            options: {
                banner: '<%= banner %>\n<%= jqueryCheck %>',
                stripBanners: false
            },
            // Smush all the contributed JS files together.
            staging: {
                src: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-mocks/angular-mocks.js',
                    'bower_components/angular-route/angular-route.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',
                    'bower_components/angular-touch/angular-touch.js',
                    'bower_components/angular-truncate/src/truncate.js',
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/underscore/underscore.js',

                    // libs
                    "scripts/modules/app.js",
                    "build/temp/routes.js",
                    "scripts/modules/app/controllers/AppController.js",
                    "scripts/modules/app/controllers/SettingsController.js",
                    "scripts/modules/app/directives/SettingsActionsDirective.js",

                    "scripts/modules/media/controllers/EpisodeController.js",
                    "scripts/modules/media/controllers/SearchController.js",
                    "scripts/modules/media/controllers/SubscriptionController.js",
                    "scripts/modules/media/directives/EpisodeViewDirective.js",
                    "scripts/modules/media/directives/SearchDirective.js",
                    //"scripts/modules/media/directives/SubscriptionAddDirective.js",
                    //"scripts/modules/media/directives/SubscriptionNavDirective.js",
                    //"scripts/modules/media/directives/SubscriptionViewDirective.js",
                    "scripts/modules/media/filters/EpisodeFilters.js",
                    "scripts/modules/media/filters/SubscriptionFilters.js",

                    "scripts/modules/media/models/Episode.js",
                    "scripts/modules/media/models/Subscription.js",

                    "scripts/modules/media/services/EpisodeService.js",
                    "scripts/modules/media/services/SubscriptionService.js",
                    "scripts/modules/media/services/SearchService.js",
                    "scripts/modules/media/services/MediaService.js",

                    "scripts/modules/player/controllers/PlayerController.js",
                    "scripts/modules/player/directives/NowPlayingDirective.js",
                    "scripts/modules/player/services/PlayerService.js",

                    "scripts/modules/ui/controller/NavController.js",
                    "scripts/modules/ui/directives/ActionBarDirective.js",
                    "scripts/modules/ui/directives/NavDirectives.js",
                    "scripts/modules/ui/services/OverlayService.js",

                    "scripts/modules/utility/models/Departures.js",
                    "scripts/modules/utility/services/DepartureService.js",
                    "scripts/modules/utility/services/HelperService.js",
                    "scripts/modules/utility/services/PersistenceService.js",

                    "scripts/modules/vendors/services/UnderscoreService.js"


                ],
                dest: 'build/temp/main.js'
            }
        },

        uglify: {
            staging: {
                files: {
                    'build/testing/assets/main.min.js': ['build/temp/main.js']
                }
            }
        },


        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            staging: {
                files: {
                    'build/testing/assets/styles.min.css': ['build/temp/styles.css']
                }
            }
        }

    });


    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    //Custom Build
    grunt.registerTask('build', ['clean:main', 'less', 'copy:main']);
    grunt.registerTask('test', ['clean:dev', 'copy:dev', 'karma']);
    grunt.registerTask('dev', ['clean:dev', 'mustache_render:dev', 'less:dev',  'copy:dev']);
    grunt.registerTask('staging', ['clean:staging', 'mustache_render:staging', 'less:staging',
    'concat:staging', 'copy:staging', 'uglify:staging', 'cssmin:staging', 'clean:temp']);


};