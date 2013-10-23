var
	gameport        = process.env.PORT || 4004,

	UUID            = require('node-uuid'),
	app             = require('express')(),
	server          = require('http').Server(app),
	io              = require('socket.io'),

	gameControl     = require("./gameControl.js"),

	verbose         = false;
var exec = require('child_process').exec

/* Express server set up. */

server.listen( gameport );
console.log('\t :: Express :: Listening on port ' + gameport );

//By default, we forward the / path to index.html automatically.
app.get( '/', function( req, res ){
    res.sendfile( __dirname + '/index.html' );
});

//This handler will listen for requests on /*, any file from the root of our server.
app.get( '/*' , function( req, res, next ) {
    var file = req.params[0];
    if(verbose) console.log('\t :: Express :: file requested : ' + file);
    res.sendfile( __dirname + '/' + file );
}); //app.get *


/* Socket.IO server set up. */



//Create a socket.io instance using our express server
var sio = io.listen(server);
sio.configure(function () {
    sio.set("transports", ["xhr-polling"]);
    sio.set("polling duration", 10);
});


sio.configure(function (){

    sio.set('log level', 0);

    sio.set('authorization', function (handshakeData, callback) {
      callback(null, true); // error first callback style
    });

});

//Socket.io will call this function when a client connects,
sio.sockets.on('connection', function (client) {
	console.log('\t socket.io:: player ' + client.id + ' connected');
	gameControl.handleClientConnect(client, sio);
}); //sio.sockets.on connection