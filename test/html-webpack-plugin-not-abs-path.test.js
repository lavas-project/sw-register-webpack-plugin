/**
 * @file test case for html-webpack-plugin
 * @author panyuqi (pyqiverson@gmail.com)
 */

/* eslint-disable fecs-use-standard-promise */
/* eslint-disable fecs-prefer-async-await */

import 'babel-polyfill'
import * as path from 'path'
import Promise from 'bluebird'
import test from 'ava'
import {
  runWebpackCompilerMemoryFs,
  testFs
} from './utils.js'

const simpleConfig = require('../examples/html-webpack-plugin/webpack.config.js')
const fs = testFs

const simpleExamplePath = path.resolve(__dirname, '../examples/html-webpack-plugin')
const webpackBuildPath = path.resolve(simpleExamplePath, './dist')

const readFile = Promise.promisify(fs.readFile, { context: fs })

test.before('run webpack build first', async t => {
  await runWebpackCompilerMemoryFs(simpleConfig({
    filePath: path.resolve(__dirname, '../examples/html-webpack-plugin/src/sw-register-relative-path.js')
  }))
  await runWebpackCompilerMemoryFs(simpleConfig({
    filePath: path.resolve(__dirname, '../examples/html-webpack-plugin/src/sw-register-url-path.js')
  }))
  await runWebpackCompilerMemoryFs(simpleConfig({
    filePath: path.resolve(__dirname, '../examples/html-webpack-plugin/src/sw-register-url-path-alias.js')
  }))
})

test('it should no service-worker.js version when service-worker.js path is relative', async t => {
  let swContent = await readFile(path.join(webpackBuildPath, 'sw-register-relative-path.js'))
  t.true(swContent.toString().includes('./a/b/service-worker.js?v='))
})

test('it should no service-worker.js version when service-worker.js path is url path', async t => {
  let swContent = await readFile(path.join(webpackBuildPath, 'sw-register-url-path.js'))
  t.true(swContent.toString().includes('https://host.com/a/b/service-worker.js?v='))
})

test('it should no service-worker.js version when service-worker.js path is url path alias', async t => {
  let swContent = await readFile(path.join(webpackBuildPath, 'sw-register-url-path-alias.js'))
  t.true(swContent.toString().includes('//host.com/a/b/service-worker.js?v='))
})
