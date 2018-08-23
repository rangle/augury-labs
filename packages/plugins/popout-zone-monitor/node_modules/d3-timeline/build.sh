#! /usr/bin/env bash

./node_modules/.bin/browserify -t vashify -t node-lessify -s timeline -e ./src/index.js > ./dist/timeline.js
