var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "ui"),
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./js/client.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      { test:  /\.json$/, loader: 'json-loader' },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
        },
      }
    ]
  },
  output: {
    path: __dirname + "/ui/bundle",
    filename: "client.min.js",
    publicPath: "/"
  },
  devServer: {
    contentBase: './',
    hot: true
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ],
  externals: {
    AppConfig: JSON.stringify(process.env.NODE_ENV === 'production' ? {
      serverUrl: "http://35.200.156.243:9000"
    } : {
      serverUrl: "http://localhost:9000"
    })
  }
};
