var testWebpackConfig = require('./webpack.test.js')({ env: 'test' });

module.exports = function (config) {
    var configuration = {
        /**
         * Base path that will be used to resolve all patterns (e.g. files, exclude).
        */
        basePath: '',

        /**
         * Frameworks to use
         *
         * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
         */
        frameworks: ['jasmine'],

        /**
         * List of files / patterns to load in the browser
         *
         * we are building the test environment in ./spec-bundle.js
         */
        files: [
            { pattern: './config/spec-bundle.js', watched: false }
        ],

        /**
         * List of files to exclude.
        */
        exclude: [],

        client: {
            captureConsole: false
        },

        /**
         * Preprocess matching files before serving them to the browser
         * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
         */
        preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },

        webpack: testWebpackConfig,

        client:{
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },

        coverageReporter: {
            type: 'in-memory'
        },

        remapCoverageReporter: {
           'text-summary': null,
            json: './coverage/coverage.json',
            html: './coverage/html'
        },

        /**
         * Webpack please don't spam the console when running in karma!
         */
        webpackMiddleware: {
            noInfo: true,
            stats: { chunks: false }
        },

        /**
         * Test results reporter to use
         *
         * possible values: 'dots', 'progress'
         * available reporters: https://npmjs.org/browse/keyword/karma-reporter
         */
        reporters: ['coverage', 'remap-coverage', 'kjhtml'],

        /**
         * Web server port.
         */
        port: 9876,

        /**
         * enable / disable colors in the output (reporters and logs)
         */
        colors: true,

        /**
         * Level of logging
         * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
         */
        logLevel: config.LOG_WARN,

        /**
         * enable / disable watching file and executing tests whenever any file changes
         */
        autoWatch: true,

        /**
         * start these browsers
         * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
         */
        browsers: [ 'Chrome', 'Firefox' ],

        /**
         * Continuous Integration mode
         * if true, Karma captures browsers, runs the tests and exits
         */
        singleRun: false,

        concurrency: Infinity
    };

    config.set(configuration);
};
