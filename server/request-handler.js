/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var fs = require('fs');
var storage = [];
var idCount = 0;
var css = '';
var app = '';
var dom = '';
var _ = '';

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
 
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';

  if (request.url === '/classes/messages' && request.method === 'POST') {
   
    var body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {

      body = JSON.parse(body);
      body['objectId'] = idCount;

      storage.push(body);

      idCount++;
    });

    statusCode = 201;

  } else if(request.url.indexOf('.css') !== -1){
    fs.readFile('../client/styles/styles.css', 'utf8', function (err, data) {
      if (err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/css'})
        response.write(data, function(err) {
          css = data;
          response.end(css);
        });
      }
    });
  } else if(request.url.indexOf('app.js') !== -1){
    fs.readFile('../client/scripts/app.js', 'utf8', function (err, data) {
      if (err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/javascript'})
        response.write(data, function(err) {
          app = data;
          response.end(app);
        });
      }
    });
  } else if(request.url.indexOf('dom') !== -1){
    fs.readFile('../client/scripts/domInteractions.js', 'utf8', function (err, data) {
      if (err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/javascript'})
        response.write(data, function(err) {
          dom = data;
          response.end(dom);
        });
      }
    });
  } else if(request.url.indexOf('jquery.js') !== -1){
    fs.readFile('../client/bower_components/jquery/dist/jquery.min.js', 'utf8', function (err, data) {
      if (err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/javascript'})
        response.write(data, function(err) {
          jquery = data;
          response.end(jquery);
        });
      }
    });
  } else if(request.url.indexOf('underscore') !== -1){
    fs.readFile('../client/bower_components/underscore/underscore-min.js', 'utf8', function (err, data) {
      if (err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/javascript'})
        response.write(data, function(err) {
          _ = data;
          response.end(_);
        });
      }
    });
   } else if (request.url === "/index")  {
    fs.readFile('../client/index.html', 'utf8', function (err, data) {
      if (err) {
        throw err;
      } else {
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.write(data, function(err) {
          file = data;
          response.end(file);
        });
      }
    });
  } else if (request.url.substring(0,6) === "/index") {
    response.end(file);

  } else if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end();

  } else if (request.method !== 'GET' && request.method !== 'POST' && request.method !== 'OPTIONS') {
    response.writeHead(405, headers);
    response.end();
  }

  // var responseBody = { 
  //   method: request.method,
  //   url: request.url,
  //   body: body,
  //   results: storage
  // };

  // response.writeHead(statusCode, headers);


  // response.end(JSON.stringify(responseBody));


  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // The outgoing status.
  // See the note below about CORS headers.
  

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // res.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;