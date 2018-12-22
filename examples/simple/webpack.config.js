/**
 * @file test webpack config
 * @author mj(zoumiaojiang@gmail.com)
 */

const path = require('path')
const SwRegisterWebpackPlugin = require('../../dist/index.js')

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
    new SwRegisterWebpackPlugin()
  ]
}

module.exports = config
