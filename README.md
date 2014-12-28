# kast

An UDP multicast rpc framework.

## Usage example

### Server

var kast = require('kast');

var server = kast();

server.command('/alive', function (req, res) {
    res.send('Yupp!');
});

server.listen(5000);

kast.broadcast({
    host: '224.0.0.1',
    port: 5000,
    command: '/alive',
    timeout: 2000,
    body: ''
}, function onResults (err, results) {
    console.log(results);
});

## Author

Copyright 2014, [André König](http://andrekoenig.info) (andre.koenig@posteo.de)