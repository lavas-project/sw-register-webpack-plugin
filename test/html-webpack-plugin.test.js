/**
 * @file test case for html-webpack-plugin
 * @author panyuqi (pyqiverson@gmail.com)
 */

/* eslint-disable fecs-use-standard-promise */

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

const readdir = Promise.promisify(fs.readdir, {context: fs});
const readFile = Promise.promisify(fs.readFile, {context: fs});

let webpackBuildStats = null;

test.before('run webpack build first', async t => {
    webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig);
});

test('it should run successfully', async t => {
    let {stats, errors} = webpackBuildStats;
    t.falsy(stats.hasWarnings() && errors.hasWarnings());
});

test('it should emit a html file', async t => {
    let files = await readdir(webpackBuildPath);
    t.true(files.includes('index.html'));
});

test('it should insert sw-register-entry into html', async t => {
    let htmlContent = await readFile(path.join(webpackBuildPath, 'index.html'));
    t.true(htmlContent.toString().includes('script.src = \'/sw-register.js?v=\''));
});
