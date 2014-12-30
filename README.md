# kast [![Build Status](https://travis-ci.org/akoenig/kast.svg)](https://travis-ci.org/akoenig/kast)

An UDP multicast RPC framework.

_Please note that this is a work in progress :)_

## Usage example

Let's say we want to start two `kast` servers on `Host A` and on `Host B`:

### Server on `Host A`

```javascript
var kast = require('kast');

var server = kast();

server.command('/alive', function (req, res) {
    res.send('Host A is alive!');
});

server.listen(5000);
```

### Server on `Host B`

```javascript
var kast = require('kast');

var server = kast();

server.command('/alive', function (req, res) {
    res.send('Host B is alive!');
});

server.listen(5000);
```

### Client

```javascript
var kast = require('kast');

kast.broadcast({
    port: 5000,
    command: '/alive',
}, function onResults (err, results) {
    console.log(results);
});
```

Output

```javascript
{
    '10.0.0.1': 'Host A is alive!',
    '10.0.0.9': 'Host B is alive!'
}
```

## Advanced example

**TBD**

## Author

Copyright 2014, [André König](http://andrekoenig.info) (andre.koenig@posteo.de)