'use strict';

const request = require("request");
const fs = require('fs');

function processPosts (posts) {
  return Object.keys(posts).map(post => {
    return new Promise ((resolve, reject) => {
      return writePost(post, posts[post], resolve, reject);
    });
  });
}

function callback(error, response, body) {
  console.log(`Interesting posts response ${response.statusCode}`);
  if (!error && response.statusCode == 200) {
    var interesting = JSON.parse(body);
    return Promise.all(processPosts(interesting.posts))
    .then(() => {
      console.log('All files written');
    });
  }
  console.error(`error response`, error);
}

function writePost (name, content, resolve, reject) {
  fs.writeFile(`source/_posts/${name}.md`, content, function(err) {
      if(err) {
        console.error('error write', err);
        return reject(err);
      }
      console.log(`file write - ${name}`);
      return resolve();
  });
}

console.log(`Get interesting posts`);
request('http://api.adamsanderson.co.uk/interesting', callback);
