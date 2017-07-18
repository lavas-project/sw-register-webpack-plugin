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

const readdir = Promise.promisify(fs.readdir, {context: fs});
const readFile = Promise.promisify(fs.readFile, {context: fs});

let webpackBuildStats = null;

test.before('run webpack build first', async t => {
    webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig());
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
    t.true(htmlContent.toString().includes('script.src = \'/sw-register.js?v='));
});

test('it should have a version `test_version`', async t => {
    webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig({version: 'test_version'}));
    let htmlContent = await readFile(path.join(webpackBuildPath, 'sw-register.js'));
    t.true(htmlContent.toString().includes('/service-worker.js?v=test_version'));
});

test('it should hava right prefix `/a/b`', async t => {
    webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig({prefix: '/a/b'}));
    let htmlContent = await readFile(path.join(webpackBuildPath, 'index.html'));
    let swContent = await readFile(path.join(webpackBuildPath, 'sw-register.js'));

    t.true(htmlContent.toString().includes('script.src = \'/a/b/sw-register.js?v='));
    t.true(swContent.toString().includes('/a/b/service-worker.js?v='));
});

test('it should no version when service-worker.js path is not absolute', async t => {
    webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig({
        filePath: path.resolve(__dirname, '../examples/html-webpack-plugin/src/sw-register-not-abs-path.js')
    }));
    let swContent = await readFile(path.join(webpackBuildPath, 'sw-register.js'));
    t.false(swContent.toString().includes('./service-worker.js?v='));
});
