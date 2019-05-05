const merge = require('webpack-merge');
const webpackConfigBase = require('../webpack.config.base');

const cfg = {
  devtool: 'eval',
  optimization: {
    concatenateModules: false,
  },
};

module.exports = merge(webpackConfigBase, cfg);
