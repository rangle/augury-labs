const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Environment config
const NODE_ENV = process.env.NODE_ENV || 'production';
const isProduction = NODE_ENV === 'production';

console.log(`
  Building Augury Labs Schematics in ${NODE_ENV} mode
`);

/*
 * Config
 */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : ' source-map',
  target: 'node',
  cache: true,
  context: __dirname,
  stats: {
    colors: true,
    reasons: true,
  },

  externals: {
    'aws-sdk': 'aws-sdk',
  },

  entry: './src/index.ts',

  // Config for our build files
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new ProgressPlugin(),
    new CopyWebpackPlugin([
      {
        from: './src/collection.json',
        to: './collection.json',
      },
      {
        from: './src/ng-add/files',
        to: './ng-add/files',
      },
      {
        from: './src/ng-add/schema.json',
        to: './ng-add/schema.json',
      },
    ]),
  ],
};
