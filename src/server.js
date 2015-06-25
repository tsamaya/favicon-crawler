var express = require('express');
var util = require('util');
var crawler = require('./crawler');
var app = express();

var usage = function() {
  'use strict';
  return 'Welcome to Favicon-Crawler.<br/>&nbsp;&nbsp;Usage /get?domain=esri.com';
};

app.get('/', function(req, res) {
  'use strict';
  res.send(usage());
});

app.get('/get', function getDomainHandler(req, res) {
  'use strict';

  if (req.query === {} || req.query.domain === undefined) {
    res.send(usage());
    return;
  } else {
    var domain = req.query.domain;
    console.log(util.format('looking for domain [%s]', domain));

    crawler.findIcon(domain, function(response) {
      console.log("crawler response status is " + response.status);
      if (response.status !== 200) {
        res.status(response.status);
        // default icon is a png
        res.set('content-type', 'image/png');
        res.end(new Buffer(response.content, 'base64'), 'binary');
      } else {
        // here is the favicon from domain
        res.status(200);
        res.set(response.headers);
        res.end(new Buffer(response.image, 'base64'), 'binary');
      }
    });
  }

});

app.listen(1515);

console.log('Server running at http://127.0.0.1:1515/');
