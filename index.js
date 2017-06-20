/**
 * @file serviceWorker register no-cache solution
 * @author mj(zoumiaojiang@gmail.com)
 */

import etpl from 'etpl';
import fs from 'fs';
import path from 'path';
import babel from 'babel-core';


const cwd = process.cwd();


/**
 * 获取时间戳版本号
 *
 * @return {string} 版本号
 */
function getVersion() {
    let d = new Date();
    let p = function (value) {
        return value < 10 ? ('0' + value) : value;
    };

    return ''
        + d.getFullYear()
        + p(d.getMonth() + 1)
        + p(d.getDate())
        + p(d.getHours())
        + p(d.getMinutes())
        + p(d.getSeconds());
}

/**
 * babel 编译
 *
 * @param {string} source 源代码
 * @return {string} 编译后的代码
 */
function babelCompiler(source) {
    return babel.transform(source, {
        comments: false,
        minified: true,
        plugins: [
            'transform-runtime',
            'external-helpers'
        ],
        presets: [
            [
                'env',
                {
                    targets: {
                        node: 3
                    },
                    modules: false
                }
            ]
        ]
    }).code;
}

/**
 * sw Register 插件
 *
 * @constructor
 * @param {Object} options 参数
 */
function SwRegisterPlugin(options = {}) {

    let filePath = path.resolve(cwd, (options.filePath || './src/sw-register.js'));

    if (!fs.existsSync(filePath)) {
        filePath = path.resolve(__dirname, '..', 'templates', 'sw-register.js');
    }
    this.filePath = filePath;
    this.fileName = path.basename(filePath);
    this.swPath = options.swPath || '/service-worker.js';
    this.version = options.version || getVersion();
}



SwRegisterPlugin.prototype.apply = function (compiler) {

    const me = this;
    const swRegisterEntryFilePath = path.resolve(__dirname, '..', 'templates', 'sw-register-entry.js.tpl');
    const swRegisterFilePath = me.filePath;

    compiler.plugin('emit', (compilation, callback) => {
        Object.keys(compilation.assets).forEach(asset => {

            if (asset.indexOf('.html') > -1) {
                let htmlContent = compilation.assets[asset].source();
                let swRegisterEntryFileTpl = fs.readFileSync(swRegisterEntryFilePath, 'utf-8');
                let swRegisterEntryFileContent = etpl.compile(swRegisterEntryFileTpl)(me);
                let con = fs.readFileSync(swRegisterFilePath, 'utf-8');

                con = babelCompiler(con)
                    .replace(
                        /serviceWorker\.register\(.*?\)/g,
                        'serviceWorker.register("' + me.swPath + '?v=' + me.version + '")'
                    );

                htmlContent = htmlContent.replace(/<\/body>/, swRegisterEntryFileContent + '</body>');

                compilation.assets[asset] = {
                    source() {
                        return htmlContent;
                    },
                    size() {
                        return htmlContent.length;
                    }
                };

                compilation.assets[me.fileName] = {
                    source() {
                        return con;
                    },
                    size() {
                        return con.length;
                    }
                };
            }
        });
        callback();
    });

};

/* eslint-disable */
export default SwRegisterPlugin;

