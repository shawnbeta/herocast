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



        // Task configuration.
        clean: {
            assets: [
                'themes/portland/assets'
            ],
            dev: [ 'build/sandbox']
        },

        mustache_render: {

            dev: {
                options: {
                    directory: 'mustache_templates'
                },
                files: [
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
                        data: 'data/episodes.json',
                        template: 'mustache_templates/media/episodes.mustache',
                        dest: 'scripts/modules/media/templates/episodes.html'
                    }

                ]
            }
        },

        //converting LESS to CSS and minifying
        less: {

            dev: {
                options: {
                    strictMath: true,
                    outputSourceFiles: true
                },
                files: {
                    //'build/sandbox/assets/css/bootstrap.css': 'bower_components/bootstrap/less/bootstrap.less',
                    'build/sandbox/assets/css/bootstrap-lite.css': 'less/bootstrap-lite.less',
                    'build/sandbox/assets/css/main.css': 'less/main.less',
                    'build/sandbox/assets/css/navBar.css': 'less/navBar.less',
                    'build/sandbox/assets/css/player.css': 'less/player.less',
                    'build/sandbox/assets/css/footer.css': 'less/footer.less',
                    'build/sandbox/assets/css/grid.css': 'less/grid.less',
                    'build/sandbox/assets/css/list.css': 'less/list.less'
                }
            },
            staging: {
                options: {
                    strictMath: true,
                    outputSourceFiles: true
                },
                files: {
                    'web/sites/all/themes/portland/assets/dev/overrides.css' : 'less/styles.less'
                }
            }



        },

        copy: {
            dev: {
                files : [
                    {

                        expand: true,
                        flatten: false,
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
                        flatten: false,
                        src: 'scripts/modules/**',
                        dest: 'build/sandbox/assets/js/'
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
                        src: 'bower_components/jquery/dist/jquery.js',
                        dest: 'build/sandbox/assets/js/contrib/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'bower_components/underscore/underscore.js',
                        dest: 'build/sandbox/assets/js/contrib/'
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
            dev: {
                src: [
                    'bower_components/jquery/dist/jquery.js'
                ],
                dest: 'themes/portland/assets/dev/scripts/libs.js'
            }
        }

    });


    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    //Custom Build
    grunt.registerTask('build', ['clean:main', 'less', 'copy:main']);
    grunt.registerTask('test', ['clean:dev', 'copy:dev', 'karma']);
    grunt.registerTask('dev', ['clean:dev', 'mustache_render:dev', 'less:dev',  'copy:dev', 'karma']);


};