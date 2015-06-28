var request = require('request');
var htmlparser2 = require('htmlparser2');

exports.findIcon = function(domain, callback) {
  'use strict';
  // default icon
  var defaultIcon = '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';
  var url = buildUrl(domain);
  // icon and favicon paths
  var icons = [];
  // fetch page at url, by default request follow http 3xx redirects
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var handler = new htmlparser2.DefaultHandler(function(err, dom) {
        if (err) {
          console.log(err);
        } else {
          fectchIcons(dom);
        }
      });
      var parser = new htmlparser2.Parser(handler);
      parser.write(body);
      parser.end();
      selectIcon();

    } else {
      // todo : look for subdomain and findIcon again
      console.log(404);
      callback({
        'status': 404,
        'content': 'domain not found'
      });
    }
  });

  function selectIcon() {
    // todo: select the best icon with image size
    console.log('Icons from website -> ' + icons.length);

    // no icon ? add default /favicon
    if (icons.length === 0) {
      console.log('add favicon.ico as navigator default');
      icons.push('/favicon.ico');
    }

    // let's begin from the end of the array
    var uri = icons[icons.length - 1];
    if (uri) {
      var iconUrl = uri;
      // a full url ?
      if (!iconUrl.match(/^http/)) {
        iconUrl = url + uri;
      }
      // let s find the icon from the url
      console.log(iconUrl);
      request({
        url: iconUrl,
        encoding: null
      }, function(error, response, rawImage) {
        // any error or not a 200 http response code ?
        if (!error && response.statusCode === 200) {
          var data = {
            'status': 200,
            'headers': response.headers,
            'image': JSON.stringify(rawImage.toString('base64')),
            'timestamp': Date.now()
          };
          //console.log(JSON.stringify(data));
          callback(data);
        } else {
          // there is a error findong this icon
          console.log('404 icon not found');
          callback({
            'status': 404,
            'content': defaultIcon
          });
        }
      });

    } else {
      // not an uri : no icon
      console.log('404 no icon');
      callback({
        'status': 404,
        'content': defaultIcon
      });

    }
  }

  function fectchIcons(dom) {
    dom.forEach(function(element) {
      if (element.name === 'html') {
        console.log('found html');
        // fetch with children
        fectchIcons(element.children);
      } else if (element.name === 'head') {
        console.log('found head');
        // fetch with children
        fectchIcons(element.children);
      } else if (element.name === 'meta' && element.attribs.itemprop === 'image') {
        console.log('found a meta image=>' + element.attribs.content);
        icons.push(element.attribs.content);
      } else if (element.name === 'link' && element.attribs.rel && element.attribs.rel.match(/icon/i)) {
        console.log('found a link/rel with icon=>' + element.attribs.href);
        if (element.attribs.sizes) {
          console.log('    with sizes=' + element.attribs.sizes);
        }
        icons.push(element.attribs.href);
      }
    });
  }
};

function buildUrl(url) {
  if (!url.match(/^http/)) {
    return 'http://' + url;
  } else {
    return url;
  }
}
