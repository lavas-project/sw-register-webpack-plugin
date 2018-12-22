#!/bin/sh

rm -rf ./dist
mkdir dist

cp -R package.json LICENSE README.md templates dist

./node_modules/.bin/babel ./src/index.js -d dist

echo 'build succeeded'
