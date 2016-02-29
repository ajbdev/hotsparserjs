"use strict";

const http = require('http');
const fs = require('fs');

http.get({
  hostname: 'heroesjson.com',
  path: '/heroes.json',
  agent: false
}, function(response) {
  //let heroes = JSON.parse(response);
  let raw = '';
  response.on('data', function(chunk) {
    raw += chunk;
  });
  response.on('end', function() {
    let heroes = JSON.parse(raw);

    fs.writeFile('lib/heroes.json', JSON.stringify(heroes));
  });
});
