var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var IP = '127.0.0.1';

var ENV = process.env.ENV = 'development';
var HOST = process.env.HOST || IP;
var PORT = process.env.PORT || 3000;
 
var metadata = {
  host: HOST,
  port: PORT,
  ENV: ENV
};

module.exports = {
  metadata: metadata,
 
  devtool: 'source-map',
 
  devServer: {
    outputPath: path.join(__dirname, 'dist'), 
    historyApiFallback: true,
    stats: 'minimal'    
  },  
 
  debug: true,

  htmlLoader: {
    minimize: false // this is needed by ng2
  },
 
  entry: {
    'app': path.resolve(__dirname, "app/main.ts"),
    'polyfills': path.resolve(__dirname, "app/deps.ts")
  },
   
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].[hash].bundle.js',
    sourcemapFilename: '[name].map'
  },
 
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js']
  },
 
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [ path.resolve(__dirname, "./app") ]
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [ path.resolve(__dirname, "index.html") ]
      },
      {   
        test: /\.global\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
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
          loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
      }
    ]
  },

  proxy : {
    '**': IP + ':3000'
  },

  sassLoader: {
    includePaths: [path.resolve(__dirname, "./app")]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),    
    new HtmlWebpackPlugin({ 
      template: 'dev.html'
    })
  ]
}
