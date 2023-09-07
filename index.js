/* 
  Primary file for the API
*/

// Dependencies
const http = require('http');

// the server should respond to all requests with a string
const server = http.createServer((req, res) => {
    res.end('hello world\n');
})

server.listen(3000, () => {
    console.log(
        "This server is listening on port 3000 now"
    )
})