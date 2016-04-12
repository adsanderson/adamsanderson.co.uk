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
  if (!error && response.statusCode == 200) {
    var interesting = JSON.parse(body);
    Promise.all(processPosts(interesting.posts));
  }
}

function writePost (name, content, resolve, reject) {
  fs.writeFile(`${name}.md`, content, function(err) {
      if(err) {
          return reject(err);
      }
      return resolve();
  });
}

request('http://api.adamsanderson.co.uk/interesting', callback);
