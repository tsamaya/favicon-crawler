var express = require('express');
var util = require('util');
var Redis = require('ioredis');
var redis = new Redis();
var cache = false;
var crawler = require('./crawler');
var app = express();

// wire events on redis
redis.on('connect', function() {
  cache = true;
  //console.log('redis is connected');
});
redis.on('close', function() {
  cache = false;
  //console.log('redis is disconnected');
});
redis.on('end', function() {
  cache = false;
  //console.log('redis is end connecion');
});

// usage function
var usage = function() {
  'use strict';
  return 'Welcome to Favicon-Crawler.<br/>&nbsp;&nbsp;Usage /get?domain=esri.com';
};

// crawler icon function
var crawlerFindIcon = function(domain, res) {
  crawler.findIcon(domain, function(response) {
    console.log("crawler response status is " + response.status);
    if (response.status !== 200) {
      res.status(response.status);
      // default icon is a png
      res.set('content-type', 'image/png');
      res.end(new Buffer(response.content, 'base64'), 'binary');
    } else {
      if (cache) {
        console.log('set cache');
        var cacheData = JSON.stringify(response);
        redis.set('favicon-crawler:' + domain, cacheData);
      }
      // here is the favicon from domain
      res.status(200);
      res.set(response.headers);
      res.end(new Buffer(response.image, 'base64'), 'binary');
    }
  });
};

// wire root
app.get('/', function(req, res) {
  'use strict';
  res.send(usage());
});

// wire /get
app.get('/get', function getDomainHandler(req, res) {
  'use strict';

  if (req.query === {} || req.query.domain === undefined) {
    res.send(usage());
    return;
  } else {
    var domain = req.query.domain;
    console.log(util.format('looking for domain [%s]', domain));
    if (cache) {
      redis.get('favicon-crawler:' + domain, function(err, result) {
        //console.log('from cache: '+result);
        // is there any error or ioredis returns emtpy strings instead of null value
        if (err || result === null || result === '') {
          crawlerFindIcon(domain, res);
        } else {
          var cacheData = JSON.parse(result);
          var now = Date.now();
          var aWeek = 7*24*3600*1000;
          if( cacheData.timestamp && now < cacheData.timestamp+aWeek) {
            console.log('data from cache');
            res.status(200);
            res.set(cacheData.headers);
            res.end(new Buffer(cacheData.image, 'base64'), 'binary');
          } else {
            console.log('refresh cache');
            crawlerFindIcon(domain, res);
          }
        }
      });
    } else {
      crawlerFindIcon(domain, res);
    }
  }

});

// listening on port 1515
app.listen(1515);

// here we go
console.log('Server running at http://127.0.0.1:1515/');
