const path = require('path');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

/*
 * Config
 */
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  cache: true,
  context: __dirname,
  stats: {
    colors: true,
    reasons: true,
  },

  entry: './src/index.ts',

  // Config for our build files
  output: {
    libraryTarget: 'umd',
    path: path.resolve('./dist'),
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['./node_modules'],
  },


  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [
          'to-string-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.png$/,
        use: 'url-loader?mimetype=image/png',
      },
      {
        test: /\.html$/,
        use: 'raw-loader',
      },
    ],
  },

  plugins: [
    new ProgressPlugin(),
  ]

};
