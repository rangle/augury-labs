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
    /**
     *  Needed here to solve build error related to
     *  dependency of node-pre-gyp which is occurring
     *  because webpack is trying to parse dependencies of
     *  node_modules
     */
    'aws-sdk': 'aws-sdk',
  },

  entry: {
    'schematics/ng-add/index': './src/schematics/ng-add/index.ts',
  },

  // Config for our build files
  output: {
    libraryTarget: 'commonjs',
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
        from: './src/schematics/ng-add/files',
        to: './schematics/ng-add/files',
      },
      {
        from: './src/schematics/ng-add/schema.json',
        to: './schematics/ng-add/schema.json',
      },
    ]),
  ],

  optimization: {},
};
