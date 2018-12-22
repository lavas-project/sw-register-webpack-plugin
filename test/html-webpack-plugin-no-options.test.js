/**
 * @file test case for html-webpack-plugin
 * @author panyuqi (pyqiverson@gmail.com)
 */

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

const readFile = Promise.promisify(fs.readFileSync, { context: fs })

test.before('run webpack build first', async () => {
  await runWebpackCompilerMemoryFs(simpleConfig())
})

test('it should be ok', async t => {
  let htmlContent = await readFile(path.join(webpackBuildPath, 'index.html'), 'utf8')

  t.true(htmlContent.toString().includes('/sw-register.js?v='))
})
