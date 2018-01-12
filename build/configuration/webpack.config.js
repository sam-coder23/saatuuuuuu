var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",

  devServer: {
    outputPath: path.join(__dirname, "dist"),
    historyApiFallback: true,
    stats: "minimal",
    proxy: {
      "/cms-rest/**":  {
        target: "https://10.98.0.231/",
        secure: false
      }
    }
  },

  debug: true,

  htmlLoader: {
    minimize: false // this is needed by ng2
  },

  entry: {
    "app": path.resolve(__dirname, "../../app/main.ts"),
    "polyfills": path.resolve(__dirname, "../../app/deps.ts")
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].bundle.js",
    sourcemapFilename: "[name].map"
  },

  resolve: {
    extensions: ["", ".ts", ".tsx", ".js"]
  },

  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: "tslint-loader"
      }
    ],
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        include: [path.resolve(__dirname, "../../app"), path.resolve(__dirname, "../../test")]
      },
      {
        test: /\.html$/,
        loader: "raw-loader",
        exclude: [path.resolve(__dirname, "../../app/index.html")]
      },
      {
        test: /\.global\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, /\.global\.scss$/],
        loaders: ["raw-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: "url-loader?limit=30000&name=[name]-[hash].[ext]"
      }
    ]
  },

  sassLoader: {
    includePaths: [path.resolve(__dirname, "../../app")]
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development")
      }
    }),
    new HtmlWebpackPlugin({
      template: "app/dev.html"
    })
  ],

  tslint: {
    // can specify a custom config file relative to current directory or with absolute path
    // "tslint-custom.json"
    configFile: "tslint.json",

    // tslint errors are displayed by default as warnings
    // set emitErrors to true to display them as errors
    emitErrors: false,

    // tslint does not interrupt the compilation by default
    // if you want any file with tslint errors to fail
    // set failOnHint to true
    failOnHint: true,

    // enables type checked rules like "for-in-array"
    // uses tsconfig.json from current working directory
    typeCheck: false,

    // automatically fix linting errors
    fix: false,

    // can specify a custom tsconfig file relative to current directory or with absolute path
    // to be used with type checked rules
    tsConfigFile: "tsconfig.json",

    // name of your formatter (optional)
    formatter: "",

    // path to directory containing formatter (optional)
    formattersDirectory: "node_modules/tslint-loader/formatters/",

    // These options are useful if you want to save output to files
    // for your continuous integration server
    fileOutput: {
      // The directory where each file"s report is saved
      dir: "./tslint/",

      // The extension to use for each report"s filename. Defaults to "txt"
      ext: "xml",

      // If true, all files are removed from the report directory at the beginning of run
      clean: true,

      // A string to include at the top of every report file.
      // Useful for some report formats.
      header: `<?xml version="1.0" encoding="utf-8"?>\n<checkstyle version="5.7">`,

      // A string to include at the bottom of every report file.
      // Useful for some report formats.
      footer: "</checkstyle>"
    }
  }
}
