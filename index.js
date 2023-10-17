/* 
  Primary file for the API
*/

// Dependencies
const http = require('http');
const https = require('https')
const url = require('url');
const config = require('./config.js')
const fs = require('fs');

const { StringDecoder } = require('string_decoder');

// the server should respond to all requests with a string
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
})

let httpsOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsOptions, (req, res) => {
    unifiedServer(req, res);
})

httpServer.listen(config.httpPort, () => {
    console.log(
        `This server is listening on port ${config.httpPort} now, on ${config.envName} environment`)
})

httpsServer.listen(config.httpsPort, () => {
    console.log(
        `This server is listening on port ${config.httpsPort} now, on ${config.envName} environment`)
})


// define handlers 
var handlers = {}

handlers.sample = function (data, callback) {
    //Callback a HTTP status code, and a payload.
    callback(406, { 'name': 'sample handler' })
}


handlers.notFound = function (data, callback) {
    callback(404, { "error": "Not Found" })
}

// Define a request router

var router = {
    '/sample': handlers.sample,
}


// All the server logic for both https and https. 
let unifiedServer = (req, res) => {
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true)

    // get the path
    const path = parsedUrl.pathname;

    const trimmedPath = path.trim();

    // get the HTTP method
    const method = req.method.toUpperCase();

    // get query string as an object
    const queryStringObject = parsedUrl.query;

    // get the headers as an object
    const headers = req.headers

    // get the payload
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request will go to. 
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        console.log('This is the trimmed path: ', trimmedPath)

        // Construct the data object 
        const data = {
            'trimmedPath': trimmedPath,
            'payload': buffer,
            'method': method,
            'queryStringObject': queryStringObject,
            'headers': headers
        }

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // send the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode)
            res.end(payloadString);

            // logs 
            console.log('Returning this response: ', statusCode, payloadString);
        })
    })
}