/**
 * @file a simple test case
 * @author panyuqi (pyqiverson@gmail.com)
 */

/* eslint-disable fecs-use-standard-promise */

import * as path from 'path'
import Promise from 'bluebird'
import test from 'ava'
import {
  runWebpackCompilerMemoryFs,
  testFs
} from './utils.js'

const simpleConfig = require('../examples/simple/webpack.config.js')
const fs = testFs

const simpleExamplePath = path.resolve(__dirname, '../examples/simple')
const webpackBuildPath = path.resolve(simpleExamplePath, './dist')

const readdir = Promise.promisify(fs.readdir, { context: fs })

let webpackBuildStats

test.before('run webpack build first', async t => {
  webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig)
})

test('it should run successfully', async t => {
  let { stats, errors } = webpackBuildStats

  t.falsy(stats === [] && errors === [])
})

test('it should emit sw-register.js', async t => {
  let files = await readdir(webpackBuildPath)
  t.true(files.includes('sw-register.js'))
})
