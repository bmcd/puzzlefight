/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström 
    
    http://underscorediscovery.com
    
    MIT Licensed. See LICENSE for full license.
 
    Usage : node simplest.app.js
*/
 
   var 
        gameport        = process.env.PORT || 4004,
 
        UUID            = require('node-uuid'),
        app             = require('express')(),
        server          = require('http').Server(app),
        io              = require('socket.io'),
        
        verbose         = false;
 
/* Express server set up. */
 
//The express server handles passing our content to the browser,
//As well as routing users where they need to go. This example is bare bones
//and will serve any file the user requests from the root of your web server (where you launch the script from)
//so keep this in mind - this is not a production script but a development teaching tool.
 
        //Tell the server to listen for incoming connections
    server.listen( gameport );
 
        //Log something so we know that it succeeded.
    console.log('\t :: Express :: Listening on port ' + gameport );
 
        //By default, we forward the / path to index.html automatically.
    app.get( '/', function( req, res ){ 
        res.sendfile( __dirname + '/index.html' );
    });
 
 
        //This handler will listen for requests on /*, any file from the root of our server.
        //See expressjs documentation for more info on routing.
 
    app.get( '/*' , function( req, res, next ) {
 
            //This is the current file they have requested
        var file = req.params[0]; 
 
            //For debugging, we can track what files are requested.
        if(verbose) console.log('\t :: Express :: file requested : ' + file);
 
            //Send the requesting client the file.
        res.sendfile( __dirname + '/' + file );
 
    }); //app.get *
var bombChance = .25;
var bombStart = 30; //starting point for the first bomb counter since it's faster than later ones
var bombWait = 60;  //wait between bombs after first
var maxQueue = 500; 
var breakerChance = 0.18;
var firstPlayerRounds = 0;
var secondPlayerRounds = 0;
var firstPlayerWins = 0;
var secondPlayerWins = 0;
var numberRounds = 1;
var firstPlayerId, secondPlayerId;
//Block Creation

//Picks random color. Returns color as a string.
var chooseColor = function() {
    var colors = ['red', 'blue', 'green', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
};

//Decides if the block is a breaker based on breakerChance. Returns string 'Block' or 'Breaker'
var chooseBreaker = function() {
    var type;
    if (Math.random() < breakerChance) {
        type = 'Breaker';
    } else {
        type = 'Block';
    }
    return type;
};

//Block object, takes a strings for color and breaker
function Block(color, breaker) {
    this.color = color;
    this.breaker = breaker;
}

//Block creator for boat
var createBlockForPlayer = function() {
    return new Block(chooseColor(), chooseBreaker());
};
//Block creator for fall (Breakers not possible)
var createBlockForFall = function() {
    return new Block(chooseColor(), 'Block');
};
var createBomb = function() {
    return new Block('bomb', 'Bomb');
};   
//The Queue
function Queue() {
    this.queue = [];
    this.bombCount = bombStart;
    this.bombReady = function() {
        this.bombCount += 1;
        return this.bombCount > bombWait && Math.random() < bombChance;
    };
    this.resetBomb = function() {
        this.bombCount = 0;
    };
    for (i = 0; i < maxQueue; i++) {
        if (this.bombReady()) {
            this.queue[i] = createBomb();
            this.resetBomb();
        } else {
            this.queue[i] = createBlockForPlayer();
        }
    }
};
/* Socket.IO server set up. */
 
//Express and socket.io can work together to serve the socket.io client files for you.
//This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.
        
        //Create a socket.io instance using our express server
    var sio = io.listen(server);
    //var ServerSide = require('./ServerSide.js');
        //Configure the socket.io connection settings. 
        //See http://socket.io/
    sio.configure(function (){
 
        sio.set('log level', 0);
 
        sio.set('authorization', function (handshakeData, callback) {
          callback(null, true); // error first callback style 
        });
 
    });
    var players = [];
    var games = [];
    for (var i = 0; i < 21; i++) {
        games.push("empty");
    };
    var playersReady = [false, false];
    var serverReady = false;
        //Socket.io will call this function when a client connects, 
        //So we can send that client a unique ID we use so we can 
        //maintain the list of players.
    
    sio.sockets.on('connection', function (client) {
        
            //Generate a new UUID, looks something like 
            //5b2ca132-64bd-4513-99da-90e838ca47d1
            //and store this on their socket/connection
        client.userid = UUID();
        client.gameNumber;
        client.playerNumber;
        client.otherPlayerNumber;
        client.otherPlayer;
        client.gameData;
        client.inLobby = true;
 
            //tell the player they connected, giving them their id
        client.emit('onconnected', { id: client.id, gameList: games, playerList: players } );
        
            //Useful to know when someone connects
        console.log('\t socket.io:: player ' + client.id + ' connected');
        players.push(client.id);
        
        client.on('createGame', function() {
            var i;
            for (i = 0; i < 22; i++) {
                if (i == 21) { 
                    client.emit('alert', { message: 'Too many games. Try again later or join another game.' });
                } else if (games[i] == "empty") {
                    client.playerNumber = 0;
                    client.gameNumber = i;
                    players.splice(players.indexOf(client.id), 1);
                    games[i] = [[client.id, false]];
                    client.emit('message', { message: 'Created Game ' + client.gameNumber });
                    client.emit('joinedGame', { gameNumber: client.gameNumber, playerNumber: client.playerNumber, practiceQueue: new Queue() });
                    client.inLobby = false;
                    break;
                };
            };
        });
        client.on('joinGame', function(data) {
            if (games[data.gameNumber].length == 1) {
                client.gameNumber = data.gameNumber;
                client.playerNumber = 1;
                client.otherPlayerNumber = 0;
                client.otherPlayer = games[client.gameNumber][client.otherPlayerNumber][0];
                games[client.gameNumber].push([client.id, false]);
                players.splice(players.indexOf(client.id), 1);
                client.emit('message', { message: 'Joined Game ' + client.gameNumber });
                client.emit('joinedGame', { gameNumber: client.gameNumber, playerNumber: client.playerNumber, practiceQueue: new Queue() });
                client.inLobby = false;
                sio.sockets.socket(client.otherPlayer).otherPlayerNumber = 1;
                sio.sockets.socket(client.otherPlayer).otherPlayer = client.id;
            } else {
                client.emit('refresh', { gameList: games, playerList: players } );
            };
        });
            
        client.on('ready', function(data) {
            games[client.gameNumber][client.playerNumber][1] = data.ready;
            if (games[client.gameNumber].length == 2 && games[client.gameNumber][0][1] && games[client.gameNumber][1][1]) {
                client.emit('reset', {} );
                sio.sockets.socket(client.otherPlayer).emit('reset', {} );
                var temp = new Queue();
                var first, second;
                if (client.playerNumber == 0) {
                    first = client.id;
                    second = client.otherPlayer;
                } else {
                    first = client.otherPlayer;
                    second = client.id;
                };
                games[client.gameNumber].push({ 
                    queue: temp.queue,
                    firstPlayerWins: 0, 
                    secondPlayerWins: 0,
                    firstPlayerRounds: 0, 
                    secondPlayerRounds: 0,
                    firstPlayerId: first, 
                    secondPlayerId: second,
                    paused: false,
                    pausedId: null,
                    ending: false
                });
                client.gameData = games[client.gameNumber][2];
                sio.sockets.socket(client.otherPlayer).gameData = games[client.gameNumber][2];
                client.emit('message', { message: client.gameData });
                client.emit('start', client.gameData);
                sio.sockets.socket(client.otherPlayer).emit('start', client.gameData);
                games[client.gameNumber][0][1] = false;
                games[client.gameNumber][1][1] = false;
            };
        });
        client.on('refresh', function() {
            client.emit('refresh', { gameList: games, playerList: players } );
        });
            //When this client disconnects
        client.on('disconnect', function () {
 
                //Useful to know when someone disconnects
            console.log('\t socket.io:: client disconnected ' + client.id );
            
            if (client.gameNumber != null) {
                players.push(client.otherPlayer);
                games[client.gameNumber] = "empty";
                sio.sockets.socket(client.otherPlayer).emit('reset', {} );
                sio.sockets.socket(client.otherPlayer).emit('onconnected', { id: client.userid, gameList: games, playerList: players } );
                sio.sockets.socket(client.otherPlayer).emit('alert', { message: 'Other player disconnected.'});
                sio.sockets.socket(client.otherPlayer).inLobby = true;
            } else {
                players.splice(players.indexOf(client.id), 1);
            };
            
        });
        client.on('blocks', function (blocks) {
            sio.sockets.socket(client.otherPlayer).emit('incomingBlocks', blocks);
        });
        client.on('boat', function (sent) {
            sio.sockets.socket(client.otherPlayer).emit('boat', sent);
        });
        client.on('grid', function (sent) {
            sio.sockets.socket(client.otherPlayer).emit('grid', sent);
        });
        client.on('waiting', function (sent) {
            sio.sockets.socket(client.otherPlayer).emit('waiting', sent);
        });
        client.on('readyAgain', function () {
            games[client.gameNumber][client.playerNumber][1] = true;
            if (games[client.gameNumber][0][1] && games[client.gameNumber][1][1]) {
                client.gameData.ending = false;
                games[client.gameNumber][0][1] = false;
                games[client.gameNumber][1][1] = false;
            };
        });
        client.on('lostPractice', function (loser) {
            client.emit('startPractice', { practiceQueue: new Queue() });
        });
        client.on('pause', function (sent) {
            if (sent.practice) {
                if (sent.paused) {
                    client.emit('unpausePractice', {});
                } else {
                    client.emit('pausePractice', {});
                };
            } else if (client.gameData.paused && client.gameData.pausedId == client.id) {
                client.emit('unpauseGame', {});
                sio.sockets.socket(client.otherPlayer).emit('unpauseGame', {});
                client.gameData.paused = false;
            } else if (!client.gameData.paused) {
                sio.sockets.socket(client.otherPlayer).emit('pauseGame', {});
                client.emit('pauseGame', {});
                client.gameData.paused = true;
                client.gameData.pausedId = client.id;
            };
        });
        client.on('tab', function (sent) {
            if (sent.practice && !sent.paused) {
                if (!client.inLobby) {
                    client.emit('pausePractice', {});
                };
            } else if (client.gameData != null && !client.gameData.paused) {
                sio.sockets.socket(client.otherPlayer).emit('pauseGame', {});
                client.emit('pauseGame', {});
                client.gameData.paused = true;
                client.gameData.pausedId = client.id;
            };
        });
        //Receive lost message from client
        client.on('lost', function (loser) {
          //checks to see if the game is currently ending in case of close finishes
          if (client.gameData != null && !client.gameData.ending) {
            //sets the game state as ending to prevent double restarts
            client.gameData.ending = true;
            //pause both clients
            client.emit('reset', {} );
            sio.sockets.socket(client.otherPlayer).emit('reset', {} );	
            //set up new queue for next game
            var temp = new Queue();
            client.gameData.queue = temp.queue;
            //set rounds or win streak data send send start message to clients
            if (client.playerNumber == 0) {
                client.gameData.secondPlayerRounds += 1;
            } else {
                client.gameData.firstPlayerRounds += 1;
            }
            if (client.gameData.firstPlayerRounds > 1) {
                client.gameData.firstPlayerRounds = 0;
                client.gameData.secondPlayerRounds = 0;
                client.gameData.firstPlayerWins += 1;
                client.gameData.secondPlayerWins = 0;
                client.emit('start', client.gameData);
                sio.sockets.socket(client.otherPlayer).emit('start', client.gameData);
            } else if (client.gameData.secondPlayerRounds > 1) {
                client.gameData.firstPlayerRounds = 0;
                client.gameData.secondPlayerRounds = 0;
                client.gameData.firstPlayerWins = 0;
                client.gameData.secondPlayerWins += 1;
                client.emit('start', client.gameData);
                sio.sockets.socket(client.otherPlayer).emit('start', client.gameData);
            } else {
                client.emit('restart', client.gameData);
                sio.sockets.socket(client.otherPlayer).emit('restart', client.gameData);
            };
          };
        });
    }); //sio.sockets.on connection