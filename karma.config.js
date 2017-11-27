module.exports = function (config) {
    config.set({
        frameworks: [
            'jasmine',
            'karma-typescript'
        ],
        reporters: [
            "progress",
            "karma-typescript",
            "html"
        ],
        preprocessors: {
            '**/*.ts': [
                'karma-typescript'
            ]
            ,'app/*.*scss': ['scss']
            ,'app/**/*.*scss': ['scss']
        },
        files: [
            {
                pattern: 'test/base.ts'
            },
            {
                pattern: 'app/**/*.ts'
            },
            {
                pattern: 'test/**/*.spec.ts'
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
                instrumentation: true                
            },
            remapOptions: {
                warn: function(message){
                    console.warn(message);
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
                                '@import "base/app/_variables.global.css"'
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
