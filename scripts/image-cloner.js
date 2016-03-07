'use strict';

var fs = require("fs");
var glob = require("glob");
var parse = require("markdown-to-ast").parse;
var request = require("request");
var path = require("path");
var url = require("url");

function isExternalIamge (node) {
    if(node.type === 'Image' && node.url.indexOf('http') !== -1) {
        return true;
    }
    return false;
}

function findExternalImages (arr) {
    return arr.reduce((prev, node) => {
        var curr = prev.concat();
        if (isExternalIamge(node)) {
            curr.push(node);    
        }
        if (node.children) {
            curr = findExternalImages(node.children).concat(curr);
        }
        return curr;
    }, []);
}

function processResult (imageNode, postdir, currentPost) {
    return new Promise((resolve) => {
        getExternalImage(imageNode, postdir)
        .then(updateMarkdown.bind(null, currentPost, imageNode))
        .then((updatedPost) => {
            resolve(updatedPost);
        })
        .catch((err) => {console.log('err', err);}); 
    });
}

function process (externalImageNodes, markdownRaw, postdir) {
    return externalImageNodes.reduce(function(promise, imageNode) {
        return promise.then(function(updatedPost) {
            return processResult(imageNode, postdir, updatedPost);
        });        
    }, Promise.resolve(markdownRaw));
}

function mkdirForPost (postname) {
    return new Promise ((resolve) => {
        let postdir = path.resolve('source/images/', path.basename(postname, '.md'));
        fs.mkdir(postdir, () => {
            console.log(arguments);
            resolve(postdir);
        });
    });
}

function getExternalImage (node, postdir) {
    return new Promise((resolve, reject) => {
        let imagename = path.basename(url.parse(node.url).pathname);
        let imagePath = path.resolve(postdir, imagename); 
        
        console.log(imagePath);
        
        request(node.url)
        .pipe(fs.createWriteStream(imagePath))
        .on('close', () => {
            console.log('getExternalImages');
            resolve();     
        })
        .on('error', (err) => {
            reject();
           console.log(err); 
        });
    });
}

function updateMarkdown (markdownRaw, imageNode, newImageLocation) {
    let template = `![${imageNode.alt}](${newImageLocation})`;
    let newMarkdown = `${markdownRaw.slice(0, imageNode.range[0])}${template}${markdownRaw.slice(imageNode.range[1])}`;
    
    return newMarkdown;
}

function writeNewMarkdown(filename, newMarkdown) {
    fs.writeFileSync(filename, newMarkdown);
}

glob("source/**/*.md", {}, function (er, files) {
    Promise.all(files.map((filename) => {
        let markdownRaw = fs.readFileSync(filename).toString();
        let markdownAst = parse(markdownRaw);
        let externalImageNodes = findExternalImages(markdownAst.children);    
        
        if (externalImageNodes.length > 0) {
            return mkdirForPost(filename)
            .then(process.bind(null, externalImageNodes, markdownRaw))
            .then(writeNewMarkdown.bind(null, filename))
            .catch((err) => console.error(err));
        }
        return Promise.resolve();
    }))
    .then(() => {
        console.log('done');
    });
});
