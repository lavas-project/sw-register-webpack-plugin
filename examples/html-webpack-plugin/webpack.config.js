const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SwRegisterWebpackPlugin = require('../../dist/index.js');

let config = {
    context: __dirname,
    entry: {
        a: './src/simple.js'
    },
    output: {
        filename: '[name].chunk.js',
        path: path.join(__dirname,'./dist')
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new SwRegisterWebpackPlugin()
    ]
};

module.exports = config;