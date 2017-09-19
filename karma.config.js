var webpack = require("./webpack.config");
module.exports = function (config) {
    config.set({
        basePath: "",
        files: [
            "./test/*.js",
        ],

        frameworks: ["jasmine"],

        preprocessors: {
            "./test/test.js": ["webpack"],
        },

        webpack: webpack,

        reporters: [
            "progress",
            "html"
        ],

        htmlReporter: {
            outputDir: "./", // where to put the reports 
            templatePath: null, // set if you moved jasmine_template.html
            focusOnFailures: true, // reports show failures on start
            namedFiles: false, // name files instead of creating sub-directories
            pageTitle: "TCR Test Report", // page title for reports; browser info by default
            urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
            reportName: "test-report", // report summary filename; browser info by default
            // experimental
            preserveDescribeNesting: false, // folded suites stay folded 
            foldAll: false, // reports start folded (only with preserveDescribeNesting)
        },

        webpackMiddleware: {
            stats: "errors-only"
        }
    });
};

