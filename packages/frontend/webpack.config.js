const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'production';
const DIST_DIR = path.join(__dirname, 'dist');
const isProduction = NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : ' source-map',

  entry: {
    polyfills: './src/polyfills.ts',
    main: './src/main.ts',
  },

  output: {
    path: DIST_DIR,
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[name].chunk.js',
  },

  performance: {
    maxAssetSize: 1250000,
    maxEntrypointSize: 1250000,
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: '@ngtools/webpack',
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: [/\.ngfactory\.js$/, /\.ngstyle\.js$/],
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

  plugins: [
    new ProgressPlugin(),
    new CleanWebpackPlugin(DIST_DIR),
    new AngularCompilerPlugin({
      tsConfigPath: 'tsconfig.json',
      entryModule: './src/app/app.module#AppModule',
      sourceMap: true,
    }),
    new FilterWarningsPlugin({
      // @angular/core issue - https://github.com/angular/angular/issues/21560
      exclude: /System.import/,
    }),
    new CopyWebpackPlugin([
      {
        from: './src/assets/fonts/rangle-font.woff2',
        to: 'rangle-font.woff2',
      },
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
