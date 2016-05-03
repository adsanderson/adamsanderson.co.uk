'use strict';

var fs = require("fs");
var glob = require("glob");
var parse = require("markdown-to-ast").parse;
var request = require("request");
var path = require("path");
var url = require("url");

function createLocations () {
    
    const SOURCE = 'source';
    const IMAGELOCATION = 'images';
    
    function postname(filename) {
        return path.basename(filename, '.md');
    }
    
    function fullPath (filename) {
        return path.resolve(SOURCE, IMAGELOCATION, postname(filename));
    }
    
    function live (filename) {
        return path.join('/', IMAGELOCATION, postname(filename));
    }

    return {
        fullPath: fullPath,
        live: live
    }
}

let location = createLocations();

function getImagePath(locationPath, imageNode) {
    let imagename = path.basename(url.parse(imageNode.url).pathname);
    return path.resolve(locationPath, imagename); 
}

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

function processResult (imageNode, filename, currentPost) {
    return new Promise((resolve) => {
        getExternalImage(imageNode, filename)
        .then(updateMarkdown.bind(null, currentPost, imageNode, filename))
        .then((updatedPost) => {
            resolve(updatedPost);
        })
        .catch((err) => {console.log('err', err);}); 
    });
}

function process (externalImageNodes, initialPost, filename) {
    return externalImageNodes.reduce(function(promise, imageNode) {
        return promise.then(function(updatedPost) {
            return processResult(imageNode, filename, updatedPost);
        });        
    }, Promise.resolve(initialPost));
}

function mkdirForPost (filename) {
    return new Promise ((resolve) => {
        fs.mkdir(location.fullPath(filename), () => {
            resolve();
        });
    });
}

function getExternalImage (node, filename) {
    return new Promise((resolve, reject) => {
        
        let imagePath = getImagePath(location.fullPath(filename), node); 
        
        request(node.url)
        .pipe(fs.createWriteStream(imagePath))
        .on('close', () => {
            console.log('getExternalImages');
            resolve();     
        })
        .on('error', (err) => {
            reject();
           console.log('request image error', err); 
        });
    });
}

function updateMarkdown (markdownRaw, imageNode, filename) {
    
    let imagePath = getImagePath(location.live(filename), imageNode); 
    
    let template = `![${imageNode.alt}](${imagePath})`;
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
            .then(process.bind(null, externalImageNodes, markdownRaw, filename))
            .then(writeNewMarkdown.bind(null, filename))
            .catch((err) => console.error(err));
        }
        return Promise.resolve();
    }))
    .then(() => {
        console.info('done');
    });
});
