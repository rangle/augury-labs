const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'production';
const isProduction = NODE_ENV === 'production';
const DIST_PATH = path.resolve('./dist');

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : ' source-map',

  entry: {
    index: './src/index.ts',
  },

  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[name].chunk.js',
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
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

  plugins: [new ProgressPlugin(), new CleanWebpackPlugin(DIST_PATH)],
};
