# sw-register-webpack-plugin

> 该插件解决 service-worker.js 文件 no-cache 问题，如果在服务端能做到对 /service-worker.js 的 no-cache, 可以忽略此方案。
主要解决服务端不能对 service-worker.js 进行 no-cache 设置，并且要求 service-worker.js 实时监测更新的场景。


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

### swPath

```js
{
    swPath: '/service-worker.js'
} 
```

`swPath` 的默认值是 `/service-worker.js`
`swPath` 如果想换其他的文件名，必须要求是绝对路径的静态资源名，并且能够访问的到


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
如果还是没找到这个文件，插件会使用内置的 sw-resgiter.js 文件进行 service worker 文件注册。


### 注意事项

`sw-register-webpack-plugin` 有一个内置的 message 时间处理函数，其作用是专门接受 service-worker.js 发送的 postMessage 事件
我们会借助这个事件完成 service-worker.js 文件更新的实时监测。

当 service-worker.js 进入 activate 状态，可以做如下操作：

```js
clients[0].postMessage('updateMessage')
```
