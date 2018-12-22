/**
 * @file with html-webpack-plugin webpack config
 * @author mj(zoumiaojiang@gmail.com)
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SwRegisterWebpackPlugin = require('../../dist/index.js')
const CopyWebpachPlugin = require('../../test/utils').MockCopyWebpackPlugin

module.exports = function (conf = {}) {
  let config = {
    context: __dirname,
    entry: {
      a: './src/simple.js'
    },
    output: {
      filename: '[name].chunk.js',
      path: path.join(__dirname, './dist')
    },
    plugins: [
      new CopyWebpachPlugin(),
      new HtmlWebpackPlugin(),
      new SwRegisterWebpackPlugin(conf)
    ]
  }

  return config
}
