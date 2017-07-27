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
    webpackBuildStats = await runWebpackCompilerMemoryFs(simpleConfig({
        version: 'test_version',
        prefix: '/a/b',
        filePath: path.resolve(__dirname, '../examples/html-webpack-plugin/src/sw-register.js'),
        excludes: [
            'str.html',
            /reg\.html$/,
            function (asset) {
                return asset.endsWith('func.html');
            }
        ],
        includes: [
            'str.html.tpl',
            /reg\.html\.tpl$/,
            function (asset) {
                return asset.endsWith('func.html.tpl');
            }
        ]
    }));
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
    t.true(htmlContent.toString().includes('script.src = \'/a/b/sw-register.js?v='));
});

test('it should have a version `test_version`', async t => {
    let htmlContent = await readFile(path.join(webpackBuildPath, 'sw-register.js'));
    t.true(htmlContent.toString().includes('/service-worker.js?v=test_version'));
});

test('it should hava right prefix `/a/b`', async t => {
    let htmlContent = await readFile(path.join(webpackBuildPath, 'index.html'));
    let swContent = await readFile(path.join(webpackBuildPath, 'sw-register.js'));

    t.true(htmlContent.toString().includes('script.src = \'/a/b/sw-register.js?v='));
    t.true(swContent.toString().includes('/a/b/service-worker.js?v='));
});

test('it should no sw-register in str.html', async t => {
    let html = await readFile(path.join(webpackBuildPath, 'str.html'));

    t.false(html.includes('sw-register.js'));
});

test('it should no sw-register in reg.html', async t => {
    let html = await readFile(path.join(webpackBuildPath, 'reg.html'));

    t.false(html.includes('sw-register.js'));
});

test('it should no sw-register in func.html', async t => {
    let html = await readFile(path.join(webpackBuildPath, 'func.html'));

    t.false(html.includes('sw-register.js'));
});

test('it should hava sw-register.js in str.html.tpl', async t => {
    let html = await readFile(path.join(webpackBuildPath, 'str.html.tpl'));

    t.true(html.includes('sw-register.js'));
});

test('it should hava sw-register.js in reg.html.tpl', async t => {
    let html = await readFile(path.join(webpackBuildPath, 'reg.html.tpl'));

    t.true(html.includes('sw-register.js'));
});

test('it should hava sw-register.js in func.html.tpl', async t => {
    let html = await readFile(path.join(webpackBuildPath, 'func.html.tpl'));

    t.true(html.includes('sw-register.js'));
});
