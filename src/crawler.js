var request = require('request');
var htmlparser2 = require('htmlparser2');

exports.findIcon = function(domain, callback) {
  'use strict';
  // default icon
  var defaultIcon = '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';
  var icon404='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';
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
      console.log('404 domain not found');
      callback({
        'status': 404,
        'content': icon404
      });
    }
  });

  function selectIcon() {
    // todo: select the best icon with image size and so loop over icons array
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
          // there is a error with this icon url
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
