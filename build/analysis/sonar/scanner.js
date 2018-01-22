/**
 * this file is holding the logic related to publishing sonar scanning
 * to the server
 */
const sonarqubeScanner = require("sonarqube-scanner");

/**
 * these are the options needed by sonar scanning module in order to display
 * the report
 */
const configuration = {
  serverUrl: "http://sonar-noi.barco.com:9000/",
  options: {
    "sonar.projectName": "collaboration-wall-manager",
    "sonar.projectVersion": "1.0.0",
    "sonar.sources": "app",
    "sonar.tests": "test",
    "sonar.typescript.lcov.reportPaths": "build/coverage/lcov.info"
  }
};

/**
 * Scanning finished callback
 * @method scanningCallback
 */
const scanningCallback = () => {
  console.log("info from code");
  console.log(arguments);
};

/**
 * Invoke the scanning
 */
sonarqubeScanner(configuration, scanningCallback);
