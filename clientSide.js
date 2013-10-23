		//This is all that needs
var socket = io.connect('/');
var clientId;
	//Now we can listen for that event
socket.on('onconnected', function( data ) {


	console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
	clientId = data.id;
	// drawLobby(data);
});

socket.on('joinedGame', function(resp) {
	//
    console.log("joinedGame", resp);
    // clearLobby();
    playerNumber = resp.gameData.playerNumber;
    startPractice(resp.gameData);
});

// socket.on('startSpec', function(data) {
//     clearLobby();
//     playerNumber = data.playerNumber;
//     startSpectating(data);
// });

// socket.on('restartSpec', function(data) {
//     restartSpectating(data);
// });

// socket.on('first', function(queue) {
//     startGame(queue);
// });

// socket.on('start', function(queue) {
//     socket.emit('readyAgain', {});
//     startGame(queue);
// });

// socket.on('restart', function(queue) {
//     socket.emit('readyAgain', {});
//     restartGame(queue);
// });
//
// socket.on('reset', function() {
//     endGame();
// });
//
// socket.on('yourTurn', function(data) {
//     console.log('In yourTurn');
//     firstPlayer = null;
//     secondPlayer = null;
//     joinGame(data.gameNumber);
// });
//
// socket.on('kicked', function() {
//     alert('Game ended');
//     refresh();
// });
//
// socket.on('createdGame', function(data) {
//     joinGame(data.gameNumber);
// });
// socket.on('pausePractice', function(data) {
//     clearTimeout(firstPlayer.timeout);
//     paused = true;
// });
//
// socket.on('unpausePractice', function(data) {
//     firstPlayer.drawBoat();
//     paused = false;
// });
//
// socket.on('pauseGame', function(data) {
//     pauseGame();
// });
//
// socket.on('unpauseGame', function(data) {
//     firstPlayer.drawBoat();
// });
//
// socket.on('ready', function(data) {
//     firstPlayer.changeReady(data.ready);
// });
//
// socket.on('startPractice', function (data) {
//     if (!inPractice) { startPractice(data); } else { firstPlayer.drawBoat(); };
// });
//
// socket.on('incomingBlocks', function(blocks) {
//     firstPlayer.receiveBlocks(blocks.number);
// });
//
// socket.on('boat', function(sent) {
//     opponent.drawBoat(sent);
// });
//
// socket.on('waiting', function(sent) {
//     opponent.drawWaiting(sent);
// });
//
// socket.on('grid', function(sent) {
// 	console.log('got grid');
//     opponent.drawGrid(sent);
// });
//
// socket.on('specBoat', function(sent) {
//     if (sent.playerNumber == 0) {
//         firstPlayer.drawBoat(sent);
//     } else {
//         secondPlayer.drawBoat(sent);
//     };
// });
//
// socket.on('specWaiting', function(sent) {
//     if (sent.playerNumber == 0) {
//         firstPlayer.drawWaiting(sent);
//     } else {
//         secondPlayer.drawWaiting(sent);
//     };
// });
//
// socket.on('specGrid', function(sent) {
//     if (sent.playerNumber == 0) {
//         firstPlayer.drawGrid(sent);
//     } else {
//         secondPlayer.drawGrid(sent);
//     };
// });

socket.on('message', function(data) {
    console.log(data.message);
});
socket.on('alert', function(data) {
    console.log(data.message);
});
// socket.on('refresh', function(data) {
//     drawLobby(data);
// });