"use strict";
let parser = require('./lib/parser').Parser;
let plugins = require('./lib/plugins').plugins;

var hotsParser = parser(process.argv[2]);

hotsParser.plugins.push(plugins.Heroes);

var data = hotsParser.parse();

console.log(data);
