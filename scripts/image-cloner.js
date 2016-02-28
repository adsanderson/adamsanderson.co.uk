'use strict';

var fs = require("fs");
var glob = require("glob");
var parse = require("markdown-to-ast").parse;



glob("source/**/*.md", {}, function (er, files) {
    var content = fs.readFileSync(files[0]);
    var result = parse(content.toString());
    console.log(result);
});

