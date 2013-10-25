var serverSide = require("./server.js")
var _und = require("./underscore.js")

var players = {};
var games = {};
var sio
//for creating games
var nextgameId = 1;

exports.handleClientConnect = function(client, theSio) {
	sio = theSio;
	client.emit('onconnected', {
		id: client.id,
	});



	client.on('disconnect', function () {
		if (client.gameId) {
			leaveGame(client);
		}
		console.log("Player", client.id, "has left the server.")
	});

	client.on('autoJoin', function() {
		autoJoinGame(client);
	})

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
          games[client.gameId].paused = false;
      } else if (!games[client.gameId].paused) {
          sio.sockets.socket(client.otherPlayer()).emit('pauseGame', {});
          client.emit('pauseGame', {});
          games[client.gameId].paused = true;
          games[client.gameId].pausedId = client.id;
      };
  });
  // client.on('readyAgain', function () {
  //     if (client.playerNumber == 0) {
  //         games[client.gameId].firstPlayerReady = true;
  //     } else if (client.playerNumber == 1) {
  //         games[client.gameId].secondPlayerReady = true;
  //     };
  //     if (games[client.gameId].firstPlayerReady && games[client.gameId].secondPlayerReady) {
  //         games[client.gameId].ending = false;
  //         games[client.gameId].firstPlayerReady = false;
  //         games[client.gameId].secondPlayerReady = false;
  //     };
  // });


  // client.on('tab', function (sent) {
  //     if (sent.practice && !sent.paused) {
  //         if (!client.inLobby) {
  //             client.emit('pausePractice', {});
  //         };
  //     } else if (games[client.gameId] != null && !games[client.gameId].paused && !client.spectating) {
  //         sio.sockets.socket(client.otherPlayer()).emit('pauseGame', {});
  //         client.emit('pauseGame', {});
  //         games[client.gameId].paused = true;
  //         games[client.gameId].pausedId = client.id;
  //     };
  // });
  //Receive lost message from client
  client.on('lost', function (loser) {
    //checks to see if the game is currently ending in case of close finishes
    if (!games[client.gameId].ending) {
      //sets the game state as ending to prevent double restarts
      games[client.gameId].ending = true;
      //pause both clients
      sio.sockets.socket(client.otherPlayer()).emit('reset', {} );
      //set up new queue for next game
      games[client.gameId].queue = new serverSide.Queue().queue;
      //set rounds or win streak data send send start message to clients
      if (client.playerNumber == 0) {
          games[client.gameId].secondPlayerRounds += 1;
      } else {
          games[client.gameId].firstPlayerRounds += 1;
      }
      if (games[client.gameId].firstPlayerRounds > 1) {
          games[client.gameId].firstPlayerRounds = 0;
          games[client.gameId].secondPlayerRounds = 0;
          games[client.gameId].firstPlayerWins += 1;
          games[client.gameId].secondPlayerWins = 0;
          client.emit('start', games[client.gameId]);
          sio.sockets.socket(client.otherPlayer()).emit('start', games[client.gameId]);
      } else if (games[client.gameId].secondPlayerRounds > 1) {
          games[client.gameId].firstPlayerRounds = 0;
          games[client.gameId].secondPlayerRounds = 0;
          games[client.gameId].firstPlayerWins = 0;
          games[client.gameId].secondPlayerWins += 1;
          client.emit('start', games[client.gameId]);
          sio.sockets.socket(client.otherPlayer()).emit('start', games[client.gameId]);
      } else {
          client.emit('restart', games[client.gameId]);
          sio.sockets.socket(client.otherPlayer()).emit('restart', games[client.gameId]);
      }
	  games[client.gameId].ending = false;
    };
  });
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
		client.playerNumber = 0;
		client.otherPlayer = function() { return games[gameId].secondPlayer };
		client.emit('joinedGame', {
			gameId: gameId,
			gameData: games[gameId],
			playerNumber: 0
		});
	} else if (!games[gameId].secondPlayer) {
		games[gameId].secondPlayer = client.id
		games[gameId].players.push(client.id)
		client.gameId = gameId;
		client.playerNumber = 1;
		client.otherPlayer = function() { return games[gameId].firstPlayer };
		client.emit('joinedGame', {
			gameId: gameId,
			gameData: games[gameId],
			playerNumber: 1
		});
	} else {
		console.log("Join failed on", gameId, games[gameId]);
		client.emit("message", { message: "Failed to join game" })
	}
	endGame(gameId);
	startGame(gameId);
}

function createGame(client) {
	console.log("In createGame");
	var gameId = nextgameId.toString();
	nextgameId += 1;

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
	} else {
		endGame(gameId, new serverSide.Queue().queue);
	}
}

function startGame(gameId) {
	if (games[gameId].players.length === 2) {
		games[gameId].queue = new serverSide.Queue().queue;
		setTimeout(function() {
			sio.sockets.socket(games[gameId].firstPlayer).emit("start", games[gameId]);
			sio.sockets.socket(games[gameId].secondPlayer).emit("start", games[gameId]);
		})
	}
}

function closeGame(gameId) {
	delete games[gameId];
	console.log("Game", gameId, "closed.")
}

function endGame(gameId, queue) {
	sio.sockets.socket(games[gameId].firstPlayer).emit("reset", { queue: queue });
	sio.sockets.socket(games[gameId].secondPlayer).emit("reset", { queue: queue });
}