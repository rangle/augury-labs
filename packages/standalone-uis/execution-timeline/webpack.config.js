const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Environment config
const NODE_ENV = process.env.NODE_ENV || 'production';
const DIST_DIR = path.join(__dirname, 'dist');
const isProduction = NODE_ENV === 'production';

/**
 *  @note: building our angular UIs without cli affords us 
 *         more flexibility and less errors. as of sept 2018, angular-cli is buggy
 *  @todo: this build is generic and should be shared across UIs in 
 *         a package like @augury/ui-tools
 */

console.log(`
  Building Performance Timeline UI in ${NODE_ENV} mode
`);

/*
 * Config
 */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : ' source-map',
  cache: true,
  context: __dirname,
  stats: {
    colors: true,
    reasons: true,
  },

  entry: {
    polyfills: './src/polyfills.ts',
    main: './src/main.ts'
  },

  // Config for our build files
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[name].chunk.js',
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['./node_modules'], // @todo: try without this
    alias: {
      // 'example': path.resolve('./src/example')
    }
  },

  // Opt-in to the old behavior with the resolveLoader.moduleExtensions
  // - https://webpack.js.org/guides/migrating/#automatic-loader-module-name-extension-removed
  resolveLoader: {
    modules: ['./node_modules'],
    moduleExtensions: ['-loader'],
  },

  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: '@ngtools/webpack',
      },
      {
        test: /\.css$/,
        use: [
          'to-string-loader',
          'css-loader',
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
    new CleanWebpackPlugin(DIST_DIR),
    new AngularCompilerPlugin({
      tsConfigPath: 'tsconfig.json',
      entryModule: './src/app/app.module#AppModule',
      sourceMap: true,
    }),
    /**
     *  this is here because of an @angular/core issue
     *  https://github.com/angular/angular/issues/21560
     */
    new FilterWarningsPlugin({
      exclude: /System.import/
    }),
    /**
     * to move the index.html file
     */
    new CopyWebpackPlugin([
      {
        from: './src/index.html',
        to: 'index.html',
      },
    ])
  ].concat(isProduction ? [
    // ... prod-only pluginss
  ] : [
      // ... dev-only plugins
      // new BundleAnalyzerPlugin(),
    ]
  ),

  /*
   * When using `templateUrl` and `styleUrls` please use `__filename`
   * rather than `module.id` for `moduleId` in `@View`
   */
  node: {
    crypto: false,
    __filename: true,
  },
};
