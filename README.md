# sw-register-webpack-plugin

[![npm version](https://badge.fury.io/js/sw-register-webpack-plugin.svg)](https://badge.fury.io/js/sw-register-webpack-plugin)
[![npm download](https://img.shields.io/npm/dm/sw-register-webpack-plugin.svg)](https://npmjs.org/sw-register-webpack-plugin)
[![Build Status](https://travis-ci.org/lavas-project/sw-register-webpack-plugin.svg?branch=master)](https://travis-ci.org/lavas-project/sw-register-webpack-plugin)

[![NPM](https://nodei.co/npm/sw-register-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/sw-register-webpack-plugin/)

> 该插件解决 `service-worker.js` 文件 `no-cache` 问题，如果在服务端能做到对 `service-worker.js` 的 `no-cache`, 可以忽略此方案。
主要解决服务端不能对 `service-worker.js` 进行 `no-cache` 设置的问题，并且要求 `service-worker.js` 实时监测更新的场景。


## Usage

### 安装

```bash
npm install sw-register-webpack-plugin --save-dev
```

### 在 webpack 插件里应用

```js
// ...
import SwRegisterWebpackPlugin from 'sw-register-webpack-plugin';
// ...

webpack({
    // ...
    plugins: [
        new SwReginsterWebpackPlugin(/* options */);
    ]
    // ...
});

// ...
```



## Options 参数


### version

```js
{
    version: 'this is a version string'
}
```
`version` 默认值是当前时间的时间版本字符串


### filePath

```js
{
    filePath: './src/sw-register.js'
}
```
`filePath` 默认值是 `./src/sw-register.js`
如果没有配置这个字段，插件会优先寻找 `./src/sw-register.js` 文件
如果还是没找到这个文件，插件会使用内置的 `sw-resgiter.js` 文件进行 `service worker` 文件注册。


### prefix

```js
{
    prefix: '/some_scope'
}
```

### includes

```js
{
    includes: [
        'a.html.tpl', // 文件名为 a.html.tpl 的文件,
        /b\.html\.tpl$/, //也可以是正则
        // 也可以是一个 callback function, 参数为待验证的每一个文件的 path
        function (asset) {
            return asset.endsWith('c.html.tpl')
        }
    ]
}
```

includes 是指定工程中非 html 文件也需要注册 sw 的，通常为模版文件。
需要注意的是，如果要指定非 html 文件也自动注册 sw, 该文件内容必须包含 `<body></body>` 标签

### excludes

```js
{
    excludes: [
        'a.html', // 文件名为 a.html 的文件,
        /b\.html$/, //也可以是正则
        // 也可以是一个 callback function, 参数为待验证的每一个文件的 path
        function (asset) {
            return asset.endsWith('c.html')
        }
    ]
}
```

excludes 是指定工程中符合自动注册的文件中的某一些文件可以不自动注册。

插件会默认使用 webpack output 中的 publicPath 来做为 service-worker.js 的 scope， 如果不想使用这个 scope， 可以通过 prefix 指定自定义的 scope。

### output

```js
{
    output: '/module/sw-register.js'
}
```

更改输出的位置，建议和`prefix`搭配使用。

### 注意事项

`sw-register-webpack-plugin` 有一个内置的 `message` 时间处理函数，其作用是专门接受 `service-worker.js` 发送的 `postMessage` 事件
我们会借助这个事件完成 `service-worker.js` 文件更新的实时监测。

当 `service-worker.js` 进入 `activate` 状态，可以做如下操作：

```js
clients[0].postMessage('sw.update')
```


`service-worker.js` 需要保证能够被访问到
