const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
        }
      ]
    }),
  ],
});
