/**
 * @file utils
 * @author panyuqi (pyqiverson@gmail.com)
 */

/* eslint-disable fecs-use-standard-promise */
/* eslint-disable fecs-prefer-async-await */

const MFS = require('memory-fs')
const fs = require('fs')
const Promise = require('bluebird')
const webpack = require('webpack')
const path = require('path')

const outputFileSystem = new MFS()

/* eslint-disable fecs-prefer-class */
/**
 * mock copy plugin
 *
 * @constructor
 */
function MockCopyPlugin () {}

MockCopyPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    let files = fs.readdirSync(path.resolve(__dirname, '../examples/html-webpack-plugin/src/htmls'))

    files.forEach(file => {
      let fileContent = fs.readFileSync(
        path.resolve(__dirname, '../examples/html-webpack-plugin/src/htmls', file),
        'utf-8'
      )
      compilation.assets[file] = {
        source () {
          return fileContent
        },
        size () {
          return fileContent.length
        }
      }
    })
  })
}

/* eslint-enable fecs-prefer-class */

exports.runWebpackCompilerMemoryFs = function runWebpackCompiler (config) {
  const compiler = webpack(config)

  compiler.outputFileSystem = outputFileSystem
  const run = Promise.promisify(compiler.run, { context: compiler })

  return run()
    .then(stats => {
      const compilation = stats.compilation
      const { errors, warnings, assets, entrypoints } = compilation

      const statsJson = stats.toJson()

      return {
        assets,
        entrypoints,
        errors,
        warnings,
        stats,
        statsJson
      }
    })
}

exports.testFs = outputFileSystem

exports.MockCopyWebpackPlugin = MockCopyPlugin
