var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",

  devServer: {
    historyApiFallback: true,
    stats: "minimal",
    proxy: {
      "/cms-rest/**":  {
        target: "https://10.98.0.231/",
        secure: false
      }
    }
  },

  // debug: true,

  entry: {
    app: path.resolve(__dirname, "../../app/main.ts"),
    polyfills: path.resolve(__dirname, "../../app/deps.ts")
  },

  output: {
    path: path.resolve(__dirname, "../build/dist"),
    filename: "[name].[hash].bundle.js",
    sourceMapFilename: "[name].map"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    // preLoaders: [
    //   {
    //     test: /\.ts$/,
    //     loader: "tslint-loader"
    //   }
    // ],
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "../../app"), path.resolve(__dirname, "../../tests")]
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
        test: /\.(woff(2)?|ttf|eot|svg|jpg|png)(\?v=\d+\.\d+\.\d+)?$/,
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
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development")
      }
    }),
    new HtmlWebpackPlugin({
      template: "app/dev.html"
    })
  ],
}
