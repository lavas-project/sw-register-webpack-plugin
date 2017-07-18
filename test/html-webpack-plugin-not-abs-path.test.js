/**
 * @file test case for html-webpack-plugin
 * @author panyuqi (pyqiverson@gmail.com)
 */

/* eslint-disable fecs-use-standard-promise */
/* eslint-disable fecs-prefer-async-await */

import 'babel-polyfill';
import * as path from 'path';
import Promise from 'bluebird';
import test from 'ava';
import {
    runWebpackCompilerMemoryFs,
    testFs
} from './utils.js';

const simpleConfig = require('../examples/html-webpack-plugin/webpack.config.js');
const fs = testFs;

const simpleExamplePath = path.resolve(__dirname, '../examples/html-webpack-plugin');
const webpackBuildPath = path.resolve(simpleExamplePath, './dist');

const readFile = Promise.promisify(fs.readFile, {context: fs});

test.before('run webpack build first', async t => {
    await runWebpackCompilerMemoryFs(simpleConfig({
        filePath: path.resolve(__dirname, '../examples/html-webpack-plugin/src/sw-register-not-abs-path.js')
    }));
});

test('it should no service-worker.js version when service-worker.js path is not absolute', async t => {
    let swContent = await readFile(path.join(webpackBuildPath, 'sw-register-not-abs-path.js'));
    t.false(swContent.toString().includes('/service-worker.js?v='));
});
