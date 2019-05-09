const merge = require('webpack-merge');
const webpackConfigBase = require('../webpack.config.base');

module.exports = merge(webpackConfigBase, {
  devtool: 'eval',
  optimization: {
    concatenateModules: false,
  },
});
