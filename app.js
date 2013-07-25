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
		var exec = require('child_process').exec

		
 
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
    var colors = ['#C0392B', '#2980B9', '#27AE60', '#F1C40F'];
    return colors[Math.floor(Math.random() * colors.length)];
};

//Decides if the block is a breaker based on breakerChance. Returns string 'Block' or 'Breaker'
var chooseBreaker = function() {
    var type;
    if (Math.random() < breakerChance) {
        type = true;
    } else {
        type = false;
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
    return new Block(chooseColor(), false);
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
	sio.configure(function () { 
        sio.set("transports", ["xhr-polling"]); 
        sio.set("polling duration", 10); 
    });
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
			exec('echo "Just created game" | ssmtp -s "User connected" bradmcdermott@gmail.com',
			  function (error, stdout, stderr) {
			    if (error !== null) {
			      console.log('exec error: ' + error);
			    }
			});
            var i;
            for (i = 0; i < 22; i++) {
                if (i == 21) { 
                    client.emit('alert', { message: 'Too many games. Try again later or join another game.' });
                } else if (games[i] == "empty") {
                    //Initializes game variables
                    var temp = new Queue();
                    games[i] = { 
                        queue: temp.queue,
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
            console.log(games[client.gameNumber].firstPlayer);
            console.log(games[client.gameNumber].secondPlayer);
            if (games[client.gameNumber].firstPlayer == null) {
                games[client.gameNumber].firstPlayer = client.id;
                client.playerNumber = 0;
                client.player = games[client.gameNumber].firstPlayer;
                client.otherPlayer = games[client.gameNumber].secondPlayer;
                client.otherPlayerNumber = 1;
                if (client.otherPlayer != null) {
                    sio.sockets.socket(client.otherPlayer).otherPlayer = client.id;
                };
                client.emit('joinedGame', { 
                    gameNumber: client.gameNumber, 
                    playerNumber: client.playerNumber, 
                    practiceQueue: new Queue(),  
                });
            } else if (games[client.gameNumber].secondPlayer == null) {
                games[client.gameNumber].secondPlayer = client.id;
                client.playerNumber = 1;
                client.player = games[client.gameNumber].secondPlayer;
                client.otherPlayer = games[client.gameNumber].firstPlayer;
                client.otherPlayerNumber = 0;
                if (client.otherPlayer != null) {
                    sio.sockets.socket(client.otherPlayer).otherPlayer = client.id;
                };
                client.emit('joinedGame', { 
                    gameNumber: client.gameNumber, 
                    playerNumber: client.playerNumber, 
                    practiceQueue: new Queue(),  
                });
            } else {
                client.playerNumber = null;
                client.emit('startSpec', games[client.gameNumber]);
            };
            players.splice(players.indexOf(client.id), 1);
            client.inLobby = false;
        });
            
        client.on('notifySpec', function() {
            games[client.gameNumber].spectators.push(client.id);
            games[client.gameNumber].quarters.push(client.id);
            client.spectating = true;
        });
        client.on('ready', function(data) {
            var ready = data.ready;
            client.game = games[client.gameNumber];
            if (client.playerNumber == 0) {
                games[client.gameNumber].firstPlayerReady = ready;
            } else if (client.playerNumber == 1) {
                games[client.gameNumber].secondPlayerReady = ready;
            };
            if (games[client.gameNumber].firstPlayerReady && games[client.gameNumber].secondPlayerReady) {
                client.emit('reset', {} );
                sio.sockets.socket(client.otherPlayer).emit('reset', {} );
                var temp = new Queue();
                games[client.gameNumber].queue = temp.queue;
                client.emit('start', games[client.gameNumber]);
                sio.sockets.socket(client.otherPlayer).emit('start', games[client.gameNumber]);
                var spec;
                for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
                    sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('restartSpec', games[client.gameNumber]);
                };
                games[client.gameNumber].firstPlayerReady = false;
                games[client.gameNumber].secondPlayerReady = false;
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
                console.log("Spectator left");
                var specNum = games[client.gameNumber].spectators.indexOf(client.id);
                var quaNum = games[client.gameNumber].quarters.indexOf(client.id);
                games[client.gameNumber].spectators.splice(specNum, 1);
                //if (quaNum != -1) {
                    games[client.gameNumber].quarters.splice(quaNum, 1);
                //};
            } else if (client.gameNumber == null) {
                console.log("Lobby player left");
                players.splice(players.indexOf(client.id), 1);
            } else {
                if (client.otherPlayer != null) {
                    sio.sockets.socket(client.otherPlayer).otherPlayer = null;
                };
                if (games[client.gameNumber].firstPlayer == client.id) {
                    console.log("First player left");
                    games[client.gameNumber].firstPlayer = null;
                } else {
                    console.log("Second player left");
                    games[client.gameNumber].secondPlayer = null;
                };
                if (games[client.gameNumber].quarters.length > 0) {
                    console.log("Grabbing player from quarters list");
                    console.log(games[client.gameNumber].quarters);
                    var tempId = games[client.gameNumber].quarters.shift();
                    sio.sockets.socket(tempId).spectating = false;
                    sio.sockets.socket(tempId).emit('yourTurn', { gameNumber: client.gameNumber });
                    games[client.gameNumber].spectators.splice(games[client.gameNumber].spectators.indexOf(tempId), 1);
                    if (client.otherPlayer != null) {
                        sio.sockets.socket(client.otherPlayer).emit('reset', {} );
                        sio.sockets.socket(client.otherPlayer).emit('alert', { message: 'Other player disconnected. New opponent sitting down.'});
                        sio.sockets.socket(client.otherPlayer).emit('startPractice', { practiceQueue: new Queue() });
                    };
                } else if (client.otherPlayer == null) {
                    console.log("No players remaining. Closing Game.");
                    console.log(games[client.gameNumber].spectators);
                    while (games[client.gameNumber].spectators.length > 0) {
                        console.log("Kicking spectator #" + tempId);
                        var tempId = games[client.gameNumber].spectators.shift();
                        sio.sockets.socket(tempId).spectating = false;
                        sio.sockets.socket(tempId).inLobby = true;
                        sio.sockets.socket(tempId).gameNumber = null;
                        sio.sockets.socket(tempId).emit('kicked', {});
                    };
                    games[client.gameNumber] = 'empty';
                } else {
                    console.log("Letting other player practice");
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
            for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
                sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('specBoat', sent)
            };
        });
        client.on('grid', function (sent) {
            sio.sockets.socket(client.otherPlayer).emit('grid', sent);
            var spec;
            for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
                sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('specGrid', sent)
            };
        });
        client.on('waiting', function (sent) {
            sio.sockets.socket(client.otherPlayer).emit('waiting', sent);
            var spec;
            for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
                sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('specWaiting', sent)
            };
        });
        client.on('readyAgain', function () {
            if (client.playerNumber == 0) {
                games[client.gameNumber].firstPlayerReady = true;
            } else if (client.playerNumber == 1) {
                games[client.gameNumber].secondPlayerReady = true;
            };
            if (games[client.gameNumber].firstPlayerReady && games[client.gameNumber].secondPlayerReady) {
                games[client.gameNumber].ending = false;
                games[client.gameNumber].firstPlayerReady = false;
                games[client.gameNumber].secondPlayerReady = false;
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
            } else if (games[client.gameNumber].paused && games[client.gameNumber].pausedId == client.id) {
                client.emit('unpauseGame', {});
                sio.sockets.socket(client.otherPlayer).emit('unpauseGame', {});
                games[client.gameNumber].paused = false;
            } else if (!games[client.gameNumber].paused && !client.spectating) {
                sio.sockets.socket(client.otherPlayer).emit('pauseGame', {});
                client.emit('pauseGame', {});
                games[client.gameNumber].paused = true;
                games[client.gameNumber].pausedId = client.id;
            };
        });
        client.on('tab', function (sent) {
            if (sent.practice && !sent.paused) {
                if (!client.inLobby) {
                    client.emit('pausePractice', {});
                };
            } else if (games[client.gameNumber] != null && !games[client.gameNumber].paused && !client.spectating) {
                sio.sockets.socket(client.otherPlayer).emit('pauseGame', {});
                client.emit('pauseGame', {});
                games[client.gameNumber].paused = true;
                games[client.gameNumber].pausedId = client.id;
            };
        });
        //Receive lost message from client
        client.on('lost', function (loser) {
          //checks to see if the game is currently ending in case of close finishes
          if (games[client.gameNumber] != null && !games[client.gameNumber].ending) {
            //sets the game state as ending to prevent double restarts
            games[client.gameNumber].ending = true;
            //pause both clients
            //client.emit('reset', {} );
            sio.sockets.socket(client.otherPlayer).emit('reset', {} );	
            //set up new queue for next game
            var temp = new Queue();
            games[client.gameNumber].queue = temp.queue;
            //set rounds or win streak data send send start message to clients
            console.log(client.playerNumber);
            if (client.playerNumber == 0) {
                games[client.gameNumber].secondPlayerRounds += 1;
            } else {
                games[client.gameNumber].firstPlayerRounds += 1;
            }
            if (games[client.gameNumber].firstPlayerRounds > 1) {
                games[client.gameNumber].firstPlayerRounds = 0;
                games[client.gameNumber].secondPlayerRounds = 0;
                games[client.gameNumber].firstPlayerWins += 1;
                games[client.gameNumber].secondPlayerWins = 0;
                client.emit('start', games[client.gameNumber]);
                sio.sockets.socket(client.otherPlayer).emit('start', games[client.gameNumber]);
                var spec;
                for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
                    sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('restartSpec', games[client.gameNumber]);
                };
            } else if (games[client.gameNumber].secondPlayerRounds > 1) {
                games[client.gameNumber].firstPlayerRounds = 0;
                games[client.gameNumber].secondPlayerRounds = 0;
                games[client.gameNumber].firstPlayerWins = 0;
                games[client.gameNumber].secondPlayerWins += 1;
                client.emit('start', games[client.gameNumber]);
                sio.sockets.socket(client.otherPlayer).emit('start', games[client.gameNumber]);
                var spec;
                for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
                    sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('restartSpec', games[client.gameNumber]);
                };
            } else {
                client.emit('restart', games[client.gameNumber]);
                sio.sockets.socket(client.otherPlayer).emit('restart', games[client.gameNumber]);
                var spec;
                for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
                    sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('restartSpec', games[client.gameNumber]);
                };
            };
          };
        });
    }); //sio.sockets.on connection