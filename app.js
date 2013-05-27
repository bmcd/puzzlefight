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
        client.game;
        client.playerNumber;
        client.otherPlayerNumber;
        client.otherPlayer;
        client.game;
        client.spectating = false;
        client.inLobby = true;
 
            //tell the player they connected, giving them their id
        client.emit('onconnected', { id: client.id, gameList: games, playerList: players } );
        
            //Useful to know when someone connects
        console.log('\t socket.io:: player ' + client.id + ' connected');
        players.push(client.id);
        
        //Create Game
        client.on('createGame', function() {
            //Makes lowest numbered game not already going
            var i;
            for (i = 0; i < 22; i++) {
                if (i == 21) { 
                    client.emit('alert', { message: 'Too many games. Try again later or join another game.' });
                } else if (games[i] == "empty") {
                    //Initializes game variables
                    games[i] = { 
                        queue: null,
                        firstPlayer: null,
                        secondPlayer: null,
                        firstPlayerReady: false,
                        secondPlayerReady: false,
                        firstPlayerWins: 0, 
                        secondPlayerWins: 0,
                        firstPlayerRounds: 0, 
                        secondPlayerRounds: 0,
                        paused: false,
                        pausedId: null,
                        ending: false,
                        spectators: [],
                        quarters: []
                    };
                    //remove from player list
                    players.splice(players.indexOf(client.id), 1);
                    client.emit('createdGame', { gameNumber: i });
                    break;
                };
            };
        });
        client.on('joinGame', function(data) {
            client.gameNumber = data.gameNumber;
            client.game = games[data.gameNumber];
            if (client.game.firstPlayer == null) {
                client.game.firstPlayer = client.id;
                client.playerNumber = 0;
                client.player = client.game.firstPlayer;
                client.otherPlayer = client.game.secondPlayer;
                client.otherPlayerNumber = 1;
                if (client.otherPlayer != null) {
                    sio.sockets.socket(client.otherPlayer).otherPlayer = client.id;
                };
            } else if (client.game.secondPlayer == null) {
                client.game.secondPlayer = client.id;
                client.playerNumber = 1;
                client.player = client.game.secondPlayer;
                client.otherPlayer = client.game.firstPlayer;
                client.otherPlayerNumber = 0;
                if (client.otherPlayer != null) {
                    sio.sockets.socket(client.otherPlayer).otherPlayer = client.id;
                };
            } else {
                client.playerNumber = null;
                client.game.spectators.push(client.id);
                client.spectating = true;
            };
            players.splice(players.indexOf(client.id), 1);
            client.emit('joinedGame', { 
                gameNumber: client.gameNumber, 
                playerNumber: client.playerNumber, 
                practiceQueue: new Queue(), 
                spectating: client.spectating, 
            });
            client.inLobby = false;
        });
            
        client.on('ready', function(data) {
            var ready = data.ready;
            client.game = games[client.gameNumber];
            if (client.playerNumber == 0) {
                client.game.firstPlayerReady = ready;
            } else if (client.playerNumber == 1) {
                client.game.secondPlayerReady = ready;
            };
            if (client.game.firstPlayerReady && client.game.secondPlayerReady) {
                client.emit('reset', {} );
                sio.sockets.socket(client.otherPlayer).emit('reset', {} );
                var temp = new Queue();
                client.game.queue = temp.queue;
                client.emit('start', client.game);
                sio.sockets.socket(client.otherPlayer).emit('start', client.game);
                var spec;
                for (spec = 0; spec < client.game.spectators.length; spec++) {
                    sio.sockets.socket(client.game.spectators[spec]).emit('startSpec', client.game);
                };
                client.game.firstPlayerReady = false;
                client.game.secondPlayerReady = false;
            };
        });
        client.on('refresh', function() {
            client.emit('refresh', { gameList: games, playerList: players } );
        });
            //When this client disconnects
        client.on('disconnect', function () {
 
                //Useful to know when someone disconnects
            console.log('\t socket.io:: client disconnected ' + client.id );
            if (client.spectating) {
                var specNum = client.game.spectators.indexOf(client.id);
                var quaNum = client.game.quarters.indexOf(client.id);
                client.game.spectators.splice(specNum, 1);
                if (quaNum != -1) {
                    client.game.quarters.splice(quaNum, 1);
                };
            } else if (client.gameNumber == null) {
                players.splice(players.indexOf(client.id), 1);
            } else {
                if (games[client.gameNumber].firstPlayer == client.id) {
                    games[client.gameNumber].firstplayer = null;
                } else {
                    games[client.gameNumber].secondplayer = null;
                };
                if (client.game.quarters.length > 0) {
                    var tempId = client.game.quarters.shift();
                    sio.sockets.socket(tempId).emit('yourTurn', { gameNumber: client.gameNumber });
                    client.game.spectators.splice(client.game.spectators.indexOf(tempId), 1);
                    if (client.otherPlayer != null) {
                        sio.sockets.socket(client.otherPlayer).emit('reset', {} );
                        sio.sockets.socket(client.otherPlayer).emit('alert', { message: 'Other player disconnected. New opponent sitting down.'});
                        sio.sockets.socket(client.otherPlayer).emit('startPractice', { practiceQueue: new Queue() });
                    };
                } else if (client.otherPlayer == null) {
                    while (client.game.spectators.length > 0) {
                        var tempId = client.game.spectators.shift();
                        sio.sockets.socket(tempId).spectating = false;
                        sio.sockets.socket(tempId).inLobby = true;
                        sio.sockets.socket(tempId).emit('kicked', {});
                    };
                    client.game = 'empty';
                } else {
                    sio.sockets.socket(client.otherPlayer).emit('reset', {} );
                    sio.sockets.socket(client.otherPlayer).emit('alert', { message: 'Other player disconnected.'});
                    sio.sockets.socket(client.otherPlayer).emit('startPractice', { practiceQueue: new Queue() });
                };
            };
        });
        client.on('blocks', function (blocks) {
            sio.sockets.socket(client.otherPlayer).emit('incomingBlocks', blocks);
        });
        client.on('boat', function (sent) {
            sio.sockets.socket(client.otherPlayer).emit('boat', sent);
            var spec;
            for (spec = 0; spec < client.game.spectators.length; spec++) {
                sio.sockets.socket(client.game.spectators[spec]).emit('specBoat', sent)
            };
        });
        client.on('grid', function (sent) {
            sio.sockets.socket(client.otherPlayer).emit('grid', sent);
            var spec;
            for (spec = 0; spec < client.game.spectators.length; spec++) {
                sio.sockets.socket(client.game.spectators[spec]).emit('specGrid', sent)
            };
        });
        client.on('waiting', function (sent) {
            sio.sockets.socket(client.otherPlayer).emit('waiting', sent);
            var spec;
            for (spec = 0; spec < client.game.spectators.length; spec++) {
                sio.sockets.socket(client.game.spectators[spec]).emit('specWaiting', sent)
            };
        });
        client.on('readyAgain', function () {
            if (client.playerNumber == 0) {
                client.game.firstPlayerReady = true;
            } else if (client.playerNumber == 1) {
                client.game.secondPlayerReady = true;
            };
            if (client.game.firstPlayerReady && client.game.secondPlayerReady) {
                client.game.ending = false;
                client.game.firstPlayerReady = false;
                client.game.secondPlayerReady = false;
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
            } else if (client.game.paused && client.game.pausedId == client.id) {
                client.emit('unpauseGame', {});
                sio.sockets.socket(client.otherPlayer).emit('unpauseGame', {});
                client.game.paused = false;
            } else if (!client.game.paused && !client.spectating) {
                sio.sockets.socket(client.otherPlayer).emit('pauseGame', {});
                client.emit('pauseGame', {});
                client.game.paused = true;
                client.game.pausedId = client.id;
            };
        });
        client.on('tab', function (sent) {
            if (sent.practice && !sent.paused) {
                if (!client.inLobby) {
                    client.emit('pausePractice', {});
                };
            } else if (client.game != null && !client.game.paused && !client.spectating) {
                sio.sockets.socket(client.otherPlayer).emit('pauseGame', {});
                client.emit('pauseGame', {});
                client.game.paused = true;
                client.game.pausedId = client.id;
            };
        });
        //Receive lost message from client
        client.on('lost', function (loser) {
          //checks to see if the game is currently ending in case of close finishes
          if (client.game != null && !client.game.ending) {
            //sets the game state as ending to prevent double restarts
            client.game.ending = true;
            //pause both clients
            //client.emit('reset', {} );
            sio.sockets.socket(client.otherPlayer).emit('reset', {} );	
            //set up new queue for next game
            var temp = new Queue();
            client.game.queue = temp.queue;
            //set rounds or win streak data send send start message to clients
            console.log(client.playerNumber);
            if (client.playerNumber == 0) {
                client.game.secondPlayerRounds += 1;
            } else {
                client.game.firstPlayerRounds += 1;
            }
            if (client.game.firstPlayerRounds > 1) {
                client.game.firstPlayerRounds = 0;
                client.game.secondPlayerRounds = 0;
                client.game.firstPlayerWins += 1;
                client.game.secondPlayerWins = 0;
                client.emit('start', client.game);
                sio.sockets.socket(client.otherPlayer).emit('start', client.game);
                var spec;
                for (spec = 0; spec < client.game.spectators.length; spec++) {
                    sio.sockets.socket(client.game.spectators[spec]).emit('startSpec', client.game);
                };
            } else if (client.game.secondPlayerRounds > 1) {
                client.game.firstPlayerRounds = 0;
                client.game.secondPlayerRounds = 0;
                client.game.firstPlayerWins = 0;
                client.game.secondPlayerWins += 1;
                client.emit('start', client.game);
                sio.sockets.socket(client.otherPlayer).emit('start', client.game);
                var spec;
                for (spec = 0; spec < client.game.spectators.length; spec++) {
                    sio.sockets.socket(client.game.spectators[spec]).emit('startSpec', client.game);
                };
            } else {
                client.emit('restart', client.game);
                sio.sockets.socket(client.otherPlayer).emit('restart', client.game);
                var spec;
                for (spec = 0; spec < client.game.spectators.length; spec++) {
                    sio.sockets.socket(client.game.spectators[spec]).emit('startSpec', client.game);
                };
            };
          };
        });
    }); //sio.sockets.on connection