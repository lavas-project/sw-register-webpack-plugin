/**
 * @file serviceWorker register no-cache solution
 * @author mj(zoumiaojiang@gmail.com)
 */

const etpl = require('etpl');
const fs = require('fs');
const path = require('path');
const babel = require('babel-core');

let cwd = process.cwd();

/**
 * 给 100 以内的数字用 0 向左补齐
 *
 * @param  {number} value 数字
 * @return {string}       补齐后的字符串
 */
let padding = function (value) {
    return value < 10 ? `0${value}` : value;
};

/**
 * 获取时间戳版本号
 *
 * @return {string} 版本号
 */
function getVersion() {
    let d = new Date();

    return ''
        + d.getFullYear()
        + padding(d.getMonth() + 1)
        + padding(d.getDate())
        + padding(d.getHours())
        + padding(d.getMinutes())
        + padding(d.getSeconds());
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
        filePath = path.resolve(__dirname, 'templates', 'sw-register.js');
    }
    this.filePath = filePath;
    this.fileName = path.basename(filePath);
    this.version = options.version || getVersion();
}



SwRegisterPlugin.prototype.apply = function (compiler) {
    let me = this;
    let swRegisterEntryFilePath = path.resolve(__dirname, 'templates', 'sw-register-entry.js.tpl');
    let swRegisterFilePath = me.filePath;

    compiler.plugin('emit', (compilation, callback) => {
        let publicPath = me.publicPath = ((compilation.outputOptions.publicPath || '') + '/').replace(/\/{1,}/g, '/');

        Object.keys(compilation.assets).forEach(asset => {

            if (asset.indexOf('.html') > -1) {
                let htmlContent = compilation.assets[asset].source();
                let swRegisterEntryFileTpl = fs.readFileSync(swRegisterEntryFilePath, 'utf-8');
                let swRegisterEntryFileContent = etpl.compile(swRegisterEntryFileTpl)(me);
                let con = fs.readFileSync(swRegisterFilePath, 'utf-8');
                let version = me.version;

                /* eslint-disable max-nested-callbacks */
                con = babelCompiler(con).replace(/(['"])([^\s\;\,\(\)]+?\.js)\1/g, item => {
                    let swJs = RegExp.$2;

                    if (swJs[0] !== '/') {
                        throw new Error('Js path in `sw-register.js` must be a absolute path');
                    }

                    if (swJs.indexOf(publicPath) < 0) {
                        let ret = item.replace(
                            swJs,
                            (publicPath + '/' + swJs)
                                .replace(/\/{1,}/g, '/')
                                .replace(/\.js/g, ext => `${ext}?v=${version}`)
                        );

                        return ret;
                    }

                    return item.replace(/\.js/g, ext => `${ext}?v=${version}`);
                });

                htmlContent = htmlContent.replace(/<\/body>/, `${swRegisterEntryFileContent}</body>`);

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

module.exports = SwRegisterPlugin;
