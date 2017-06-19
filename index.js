/**
 * @file serviceWorker register no-cache solution
 * @author mj(zoumiaojiang@gmail.com)
 */

import etpl from 'etpl';
import fs from 'fs';
import path from 'path';


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
 * sw Register 插件
 *
 * @constructor
 * @param {Object} options 参数
 */
function SwRegisterPlugin(options = {}) {

    this.tplPath = options.tplPath
        ? path.resolve(process.cwd(), options.tplPath)
        : path.resolve(__dirname, '..', 'templates', 'sw-register.js.tpl');
    this.fileName = options.fileName || 'sw-register.js';
    this.swFileName = options.swFileName || 'service-worker.js';
    this.version = options.version || getVersion();
}



SwRegisterPlugin.prototype.apply = function (compiler) {

    const me = this;
    const swRegisterEntryFilePath = path.resolve(__dirname, '..', 'templates', 'sw-register-entry.js.tpl');
    const swRegisterFilePath = me.tplPath;
    const refreshTipsHtml = fs.readFileSync(path.resolve(__dirname, '..', 'templates', 'refresh-tips.tpl'), 'utf-8')
        .replace(/\n/g, '\'\n+ \'');

    me.refreshTipsHtml = refreshTipsHtml;

    compiler.plugin('emit', (compilation, callback) => {
        Object.keys(compilation.assets).forEach(asset => {

            if (asset.indexOf('.html') > -1) {
                let htmlContent = compilation.assets[asset].source();
                let swRegisterEntryFileTpl = fs.readFileSync(swRegisterEntryFilePath, 'utf-8');
                let swRegisterEntryFileContent = etpl.compile(swRegisterEntryFileTpl)(me);

                let swRegisterFileTpl = fs.readFileSync(swRegisterFilePath, 'utf-8');
                let swRegisterFileContent = etpl.compile(swRegisterFileTpl)(me);

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
                        return swRegisterFileContent;
                    },
                    size() {
                        return swRegisterFileContent.length;
                    }
                };
            }
        });
        callback();
    });

};

/* eslint-disable */
export default SwRegisterPlugin;

