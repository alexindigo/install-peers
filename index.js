#!/usr/bin/env node

var path = require('path');

var npmModule = path.resolve(process.env['npm_execpath'], '..');
//console.log('DEPS', process.env);

console.log('npmModule', npmModule);


process.exit(1);
