var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ENV = process.env.ENV = "production";

module.exports = {
  mode: ENV,

  // metadata: {
  //   ENV: ENV
  // },

  devtool: "cheap-source-map",
  stats: "errors-only",

  entry: {
    "polyfills": path.resolve(__dirname, "../../app/deps.ts"),
    "app": path.resolve(__dirname, "../../app/main.ts")
  },

  // debug: false,

  output: {
    path: path.resolve(__dirname, "../build/dist"),
    filename: "[name].[contentHash].bundle.js",
    sourceMapFilename: "[name].map"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: [ path.resolve(__dirname, "../../app") ]
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: [path.resolve(__dirname, "../../app/index.html")],
        options: {
          minimize: false // this is needed by angular2 and beyond
        }
      },
      {
        test: /\.global\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, /\.global\.scss$/],
        use: ["to-string-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name(file) {
                return "[name].[ext]";
              }
            }
          }
        ]
      }
    ]
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
        context: "./build/jboss",
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

    new webpack.optimize.AggressiveMergingPlugin()
  ]
}
