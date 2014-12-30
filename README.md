# kast [![Build Status](https://travis-ci.org/akoenig/kast.svg)](https://travis-ci.org/akoenig/kast)

An UDP multicast RPC framework.

## Usage example

Let's say we want to start two `kast` servers, each of which provides a command to check if they are alive.

`Host A`:

```javascript
var kast = require('kast');

var server = kast();

server.command('/alive', function (req, res) {
    res.send('Hey! Host A is alive!');
});

server.listen(5000);
```

`Host B`:

```javascript
var kast = require('kast');

var server = kast();

server.command('/alive', function (req, res) {
    res.send('This is Host B speaking! How can I help you?');
});

server.listen(5000);
```

`Client`:

A third host, the client, can now send a _broadcast request_ to all the hosts without knowing each individual ip address / host name.

```javascript
var kast = require('kast');

kast.broadcast({
    port: 5000,
    command: '/alive',
}, function onResults (err, results) {
    console.log(results);
});
```

If everything went fine, the `results` argument will be an object with the following structure:

```javascript
{
    '10.0.0.1': 'Hey! Host A is alive!',
    '10.0.0.23': 'This is Host B speaking! How can I help you?'
}
```

## Author

Copyright 2014, [André König](http://andrekoenig.info) (andre.koenig@posteo.de)
