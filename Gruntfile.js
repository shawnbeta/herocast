module.exports = function (grunt) {
    'use strict';



    // Project configuration.
    grunt.initConfig({



        // Task configuration.
        clean: {
            assets: [
                'themes/portland/assets'
            ],
            dev: [
                'build/sandbox'
            ]
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
                    'build/sandbox/assets/css/bootstrap.css': 'bower_components/bootstrap/less/bootstrap.less',
                    'build/sandbox/assets/css/styles.css': 'less/styles.css'
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
    grunt.registerTask('dev', ['clean:dev', 'mustache_render:dev', 'less:dev',  'copy:dev']);


};