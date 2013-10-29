module.exports = function (grunt) {
    var path = require('path');
    var config = {};

    var namespaces = {};

    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-contrib-watch');
        config.watch = {};
    }

    // release
    {
        grunt.loadNpmTasks('grunt-release');

        config.release = {
            options: {
                file: '../loadMore.jquery.json',
                npm: false
            }
        };
    }

    var configureEnv = function (name, env) {
        // css
        {
            grunt.loadNpmTasks('grunt-contrib-compass');
    
            config.compass = config.compass || {};
            config.compass[name] = {
                options: {
                    sassDir                 : 'sass',
                    cssDir                  : path.resolve(env.sitePath, 'css'),
                    javascriptsDir          : path.resolve(env.sitePath, 'js'),
                    imagesDir               : path.resolve(env.sitePath, 'img'),
                    generatedImagesPath     : path.resolve(env.sitePath, 'img'),
                    httpImagesPath          : path.resolve(env.httpPath, 'img'),
                    httpGeneratedImagesPath : path.resolve(env.httpPath, 'img'),
                    environment             : 'development'
                }
            };
    
            if (env.watch) {
                config.watch.css = {
                    files: ['sass/*.scss', 'sass/**/*.scss'],
                    tasks: ['compass:' + name]
                };
            }
    
            env.tasks.push('compass:' + name);
        }
    
    
        // ejs
        if (env.ejs) {
            grunt.loadNpmTasks('grunt-simple-ejs');
    
            config.ejs = config.ejs || {};
            config.ejs[name] = {
                templateRoot: 'ejs',
                template: ['*.ejs'],
                dest: env.sitePath,
                include: [
                    'bower_components/ejs-head-modules/*.ejs',
                    'bower_components/ejs-sns-modules/*.ejs',
                    'ejs/layout/*.ejs'
                ],
                silentInclude: true,
                options: [
                    {
                        http_path : env.httpPath,
                        css_path  : path.resolve(env.httpPath, 'css'),
                        js_path   : path.resolve(env.httpPath, 'js' ),
                        img_path  : path.resolve(env.httpPath, 'img')
                    },
                    'options.yaml'
                ]
            };
            env.tasks.push('ejs:' + name);
            
            if (env.watch) {
                config.watch.ejs = {
                    files: [
                        'ejs/*.ejs',
                        'ejs/**/*.ejs',
                        'options.yaml'
                    ],
                    tasks: ['ejs:' + name]
                };
            }
        }

    
        // test
        if (env.test) {
            grunt.loadNpmTasks('grunt-mocha-html');
            grunt.loadNpmTasks('grunt-mocha-phantomjs');
    
            config.mocha_html = config.mocha_html || {};
            config.mocha_html[name] = {
                src   : [ path.resolve(env.sitePath, 'js', 'loadMore.js') ],
                test  : [ 'test/*-test.js' ],
                assert : 'chai'
            };
            env.tasks.push('mocha_html');
    
            
            if (env.watch) {
                config.watch.test = {
                    files: ['test/*-test.js'],
                    tasks: ['mocha_phantomjs']
                };
                // config.watch.js.tasks.push('mocha_html');
            }
    
            config.mocha_phantomjs =  {
                all: [ 'test/*.html' ]
            };
    
            grunt.registerTask('test', ['mocha_phantomjs']);
    
        }
    
    
        // server
        {
            grunt.loadNpmTasks('grunt-koko');
    
            config.koko = config.koko || {};
            config.koko[name] = {
                root: path.resolve(env.sitePath, path.relative(env.httpPath, '/')),
                openPath: env.httpPath
            };
    
            grunt.registerTask('server', ['koko:' + name]);
        }

        // set as task
        grunt.registerTask(name, env.tasks);
    };

    configureEnv('example', {
        tasks: [],
        sitePath: '../example',
        httpPath: '/example/',
        watch: true,
        ejs: true,
        test: true,
        demo: true
    });

    // init
    grunt.initConfig(config);
    grunt.registerTask('default', ['example']);
};
