var serverSide = require("./server.js")
var _und = require("./underscore.js")

var players = {};
var games = {};

exports.handleClientConnect = function(client) {
	client.emit('onconnected', {
		id: client.id,
	});

	autoJoinGame(client);

  client.on('createGame', function() {
      //Makes lowest numbered game not already going
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
}

function autoJoinGame(client) {
	var foundGame;
	_und.each(games, function(game, id) {
		console.log("Id: ", id,"Game Data: ", game, "Game Length:", game.length);
		if (game.length < 2 && !foundGame) {
			foundGame = id;
		}
	});

	console.log("Found Game: ", foundGame);
	if (foundGame) {
		console.log("Joining game " + foundGame)
		joinGame(foundGame, client);
	} else {
		console.log("Creating new game")
		createGame(client);
	}
}