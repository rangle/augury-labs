const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'production';
const isProduction = NODE_ENV === 'production';
const DIST_PATH = './dist';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : ' source-map',
  target: 'node',

  externals: {
    /**
     *  Needed here to solve build error related to
     *  dependency of node-pre-gyp which is occurring
     *  because webpack is trying to parse dependencies of
     *  node_modules
     */
    'aws-sdk': 'aws-sdk',
    fsevents: 'fsevents',
  },

  entry: {
    'schematics/ng-add/index': './src/schematics/ng-add/index.ts',
  },

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
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new ProgressPlugin(),
    new CleanWebpackPlugin(DIST_PATH),
    new FilterWarningsPlugin({
      exclude: [
        /Critical dependency: the request of a dependency is an expression/,
        /require.extensions is not supported by webpack. Use a loader instead./,
      ],
    }),
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
};
