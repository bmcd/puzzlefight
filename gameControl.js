var serverSide = require("./server.js")
var _und = require("./underscore.js")

var players = {};
var games = {};
//for creating games
var nextGameNumber = 1;

exports.handleClientConnect = function(client, sio) {
	client.emit('onconnected', {
		id: client.id,
	});

	autoJoinGame(client);

	client.on('disconnect', function () {
		if (client.gameId) {
			leaveGame(client);
		}
		console.log("Player", client.id, "has left the server.")
	});

  client.on('blocks', function (blocks) {
      sio.sockets.socket(client.otherPlayer()).emit('incomingBlocks', blocks);
  });
  client.on('boat', function (sent) {
      sio.sockets.socket(client.otherPlayer()).emit('boat', sent);
  });
  client.on('grid', function (sent) {
      sio.sockets.socket(client.otherPlayer()).emit('grid', sent);
  });
  client.on('waiting', function (sent) {
      sio.sockets.socket(client.otherPlayer()).emit('waiting', sent);
  });

  client.on('lostPractice', function (loser) {
      client.emit('startPractice', { queue: new serverSide.Queue().queue });
  });

  client.on('pause', function (sent) {
      if (sent.practice) {
          if (sent.paused) {
              client.emit('unpausePractice', {});
          } else {
              client.emit('pausePractice', {});
          };
      } else if (games[client.gameId].paused && games[client.gameId].pausedId == client.id) {
          client.emit('unpauseGame', {});
          sio.sockets.socket(client.otherPlayer()).emit('unpauseGame', {});
          games[client.gameNumber].paused = false;
      } else if (!games[client.gameId].paused) {
          sio.sockets.socket(client.otherPlayer()).emit('pauseGame', {});
          client.emit('pauseGame', {});
          games[client.gameNumber].paused = true;
          games[client.gameNumber].pausedId = client.id;
      };
  });
  // client.on('readyAgain', function () {
  //     if (client.playerNumber == 0) {
  //         games[client.gameNumber].firstPlayerReady = true;
  //     } else if (client.playerNumber == 1) {
  //         games[client.gameNumber].secondPlayerReady = true;
  //     };
  //     if (games[client.gameNumber].firstPlayerReady && games[client.gameNumber].secondPlayerReady) {
  //         games[client.gameNumber].ending = false;
  //         games[client.gameNumber].firstPlayerReady = false;
  //         games[client.gameNumber].secondPlayerReady = false;
  //     };
  // });


  // client.on('tab', function (sent) {
  //     if (sent.practice && !sent.paused) {
  //         if (!client.inLobby) {
  //             client.emit('pausePractice', {});
  //         };
  //     } else if (games[client.gameNumber] != null && !games[client.gameNumber].paused && !client.spectating) {
  //         sio.sockets.socket(client.otherPlayer).emit('pauseGame', {});
  //         client.emit('pauseGame', {});
  //         games[client.gameNumber].paused = true;
  //         games[client.gameNumber].pausedId = client.id;
  //     };
  // });
  // //Receive lost message from client
  // client.on('lost', function (loser) {
  //   //checks to see if the game is currently ending in case of close finishes
  //   if (games[client.gameNumber] != null && !games[client.gameNumber].ending) {
  //     //sets the game state as ending to prevent double restarts
  //     games[client.gameNumber].ending = true;
  //     //pause both clients
  //     //client.emit('reset', {} );
  //     sio.sockets.socket(client.otherPlayer).emit('reset', {} );
  //     //set up new queue for next game
  //     var temp = new Queue();
  //     games[client.gameNumber].queue = temp.queue;
  //     //set rounds or win streak data send send start message to clients
  //     console.log(client.playerNumber);
  //     if (client.playerNumber == 0) {
  //         games[client.gameNumber].secondPlayerRounds += 1;
  //     } else {
  //         games[client.gameNumber].firstPlayerRounds += 1;
  //     }
  //     if (games[client.gameNumber].firstPlayerRounds > 1) {
  //         games[client.gameNumber].firstPlayerRounds = 0;
  //         games[client.gameNumber].secondPlayerRounds = 0;
  //         games[client.gameNumber].firstPlayerWins += 1;
  //         games[client.gameNumber].secondPlayerWins = 0;
  //         client.emit('start', games[client.gameNumber]);
  //         sio.sockets.socket(client.otherPlayer).emit('start', games[client.gameNumber]);
  //         var spec;
  //         for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
  //             sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('restartSpec', games[client.gameNumber]);
  //         };
  //     } else if (games[client.gameNumber].secondPlayerRounds > 1) {
  //         games[client.gameNumber].firstPlayerRounds = 0;
  //         games[client.gameNumber].secondPlayerRounds = 0;
  //         games[client.gameNumber].firstPlayerWins = 0;
  //         games[client.gameNumber].secondPlayerWins += 1;
  //         client.emit('start', games[client.gameNumber]);
  //         sio.sockets.socket(client.otherPlayer).emit('start', games[client.gameNumber]);
  //         var spec;
  //         for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
  //             sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('restartSpec', games[client.gameNumber]);
  //         };
  //     } else {
  //         client.emit('restart', games[client.gameNumber]);
  //         sio.sockets.socket(client.otherPlayer).emit('restart', games[client.gameNumber]);
  //         var spec;
  //         for (spec = 0; spec < games[client.gameNumber].spectators.length; spec++) {
  //             sio.sockets.socket(games[client.gameNumber].spectators[spec]).emit('restartSpec', games[client.gameNumber]);
  //         };
  //     };
  //   };
  // });
}

function autoJoinGame(client) {
	var foundGame;
	_und.each(games, function(game, id) {
		if (game.players.length < 2 && !foundGame) {
			foundGame = id;
		}
	});

	console.log("Found Game: ", foundGame);
	if (foundGame) {
		console.log("Joining game " + foundGame.gameId)
		joinGame(foundGame, client);
	} else {
		console.log("Creating new game")
		createGame(client);
	}
}

function joinGame(gameId, client) {
	console.log("In joinGame");
	if (!games[gameId].firstPlayer) {
		games[gameId].firstPlayer = client.id
		games[gameId].players.push(client.id)
		client.gameId = gameId;
		client.otherPlayer = function() { return games[gameId].secondPlayer };
		client.emit('joinedGame', {
			gameId: gameId,
			gameData: games[gameId],
			playerNumber: 1
		});
	} else if (!games[gameId].secondPlayer) {
		games[gameId].secondPlayer = client.id
		games[gameId].players.push(client.id)
		client.gameId = gameId;
		client.otherPlayer = function() { return games[gameId].firstPlayer };
		client.emit('joinedGame', {
			gameId: gameId,
			gameData: games[gameId],
			playerNumber: 2
		});
	} else {
		console.log("Join failed on", gameId, games[gameId]);
		client.emit("message", { message: "Failed to join game" })
	}
}

function createGame(client) {
	console.log("In createGame");
	var gameId = nextGameNumber.toString();
	nextGameNumber += 1;

	games[gameId] = makeGameData(client.id, gameId);
	console.log("Create Game " + gameId);

	client.gameId = gameId;
	client.otherPlayer = function() { return games[gameId].secondPlayer };

	client.emit('joinedGame', {
		gameId: gameId,
		gameData: games[gameId],
		playerNumber: 1
	});
}

function makeGameData(firstPlayerId, gameId) {
	return {
		gameId: gameId,
		queue: new serverSide.Queue().queue,
		players: [firstPlayerId],
		firstPlayer: firstPlayerId,
		secondPlayer: null,
		firstPlayerWins: 0,
		secondPlayerWins: 0,
		firstPlayerRounds: 0,
		secondPlayerRounds: 0,
		paused: false,
		pausedId: null,
		ending: false
		}
}

function leaveGame(client) {
	var gameId = client.gameId;
	var index = games[gameId].players.indexOf(client.id);
	games[gameId].players.splice(index, 1);
	if (games[gameId].firstPlayer === client.id) {
		games[gameId].firstPlayer = null;
	}
	if (games[gameId].secondPlayer === client.id) {
		games[gameId].secondPlayer = null;
	}
	console.log("Player", client.id, "has left game", gameId);
	if (games[gameId].players.length === 0) {
		closeGame(gameId);
	}
}

function closeGame(gameId) {
	games[gameId] = null;
	console.log("Game", gameId, "closed.")
}