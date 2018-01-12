var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ENV = process.env.ENV = "production";

module.exports = {
  htmlLoader: {
    minimize: false // this is needed by ng2
  },

  metadata: {
      ENV: ENV
  },

  devtool: "cheap-source-map",

  entry: {
    "polyfills": path.resolve(__dirname, "../../app/deps.ts"),
    "app": path.resolve(__dirname, "../../app/main.ts")
  },

  debug: false,

  output: {
    path: "./build/dist",
    filename: "[name].[hash].bundle.js",
    sourcemapFilename: "[name].map"
  },

  resolve: {
    extensions: ["", ".ts", ".tsx", ".js"]
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        include: [ path.resolve(__dirname, "../../app") ]
      },
      {
        test: /\.html$/,
        loader: "raw-loader",
        exclude: [ path.resolve(__dirname, "../../app/index.html") ]
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
    new HtmlWebpackPlugin({
      template: "app/index.html",
      chunksSortMode: function(first, second) {
        return (first.names[0].indexOf("polyfills") >= 0)? -1 : 1;
      },
      chunks: ["polyfills", "app"],
    }),
    new CopyWebpackPlugin([
      {
        context: ".",
        from: "WEB-INF/*.xml"
      },
	    {
        context: "./app",
        from: "resources/**/*.svg"
      },
	    {
        context: "./app",
        from: "*.png"
      },
	    {
        context: "./app",
        from: "manifest.json"
      },
      {
        context: "./app",
        from: "resources/**/*.jpg"
      },
      {
        context: "./app",
        from: "i18n/*.json"
      },
      {
        context: "./app",
        from: "version.properties"
      }
    ],
    {
      ignore: [".svn"]
    }),

    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ["$super", "exports", "require"]
      },
      compress: {
        warnings: false,
        dead_code : true,
        drop_debugger: true,
        unused: true,
        drop_console: true
      },
      output: {
        comments: false
      }
    })
  ]
}
