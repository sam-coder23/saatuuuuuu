module.exports = function (config) {
    config.set({
        basePath: "../..",
        proxies: {
            "/settings/language/resources/": "/base/app/resources/",
            "/settings/language/icon_barco.png": "/base/app/icon_barco.png",
            "/display-panel/resources/": "/base/app/resources/",
            "/display-panel/icon_barco.png": "/base/app/icon_barco.png",
            "/resources/": "/base/app/resources/",
            "/icon_barco.png": "/base/app/icon_barco.png",
            "/home/resources/": "/base/app/resources/",
            "/home/icon_barco.png": "/base/app/icon_barco.png",
 			"/display_snapshot.jpg": "/base/app/resources/images/display_snapshot.jpg",
             "/home/display_snapshot.jpg": "/base/app/resources/images/display_snapshot.jpg"
        },
        frameworks: [
            'jasmine',
            'karma-typescript'
        ],
        reporters: [
            "progress",
            "karma-typescript",
            "html"
        ],
        htmlReporter: {
            outputDir: "build/reports",
            reportName: "karma-test-report",
            preserveDescribeNesting: false,
            foldAll: false,
        },
        preprocessors: {
            '**/*.ts': [
                'karma-typescript'
            ]
            ,'app/*.*scss': ['scss']
            ,'app/**/*.*scss': ['scss']
        },
        autoWatch: true,
        files: [
            {
                pattern: 'test/base.ts'
            },
            {
                pattern: 'app/**/*.ts'
            },
            {
                pattern: 'test/**/*.ts'
            },
            {
                pattern: 'app/**/*.png',
                included: false
            },
            {
                pattern: 'app/**/*.jpg',
                included: false
            },
            {
                pattern: 'app/**/*.svg',
                included: false
            },
            {
                pattern: "./app/i18n/*.json",
                watched: true,
                served: true,
                included: false
            },
            {
                pattern: 'app/*.*scss',
                watched: true,
                included: true,
                served: true
            },
            {
                pattern: 'app/main.ts',
                watched: false,
                included: false,
                served: false
            }
        ],
        karmaTypescriptConfig: {
            exclude: ["broken"],
            tsconfig: './tsconfig.json',
            coverageOptions: {
                instrumentation: true,
                exclude: [/\.(spec|mock|stub).ts$/i, /deps.ts/, /main.ts/, /base.ts/]
            },
            remapOptions: {
                warn: function(message){
                    console.warn(message);
                }
            },
            reports: {
                "html": {
                    "directory": "build/reports",
                    "subdirectory": "coverage-report",
                    "filename": "coverage"
                }
            },
            bundlerOptions: {
                entrypoints: /base\.ts|\.spec\.ts$/,
                resolve: {
                    extensions: [".js", ".json"],
                    directories: ["node_modules"]
                },
                transforms: [
                    require('karma-typescript-es6-transform')({
                        presets: ['es2015', 'stage-0'],
                        extensions: ['.ts', '.js'],
                        plugins: [
                            ["transform-runtime", {
                                regenerator: true,
                                polyfill: true
                            }]
                        ]
                    }),
                    /**
                     * Custom transformer to resolved the issue related
                     * to importing the css from server.
                     */
                    function(context, callback) {
                        if(context.module.indexOf('.scss') !== -1) {
                            context.source = context.source.replace(
                                '@import "variables.global";',
                                '@import "/base/app/_variables.global.css"'
                            );
                            return callback(undefined, true);
                        }
                        return callback(undefined, false);
                    }
                ]
            }
        },
        logLevel: config.LOG_INFO,
        browsers: [
            'Chrome'
        ]
    });
};
