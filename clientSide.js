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
    console.log("in joinedGame");
    // clearLobby();
    playerNumber = resp.gameData.playerNumber;
    startPractice(resp.gameData);
});

socket.on('start', function(queue) {
	console.log("in start");
    startGame(queue);
});

// socket.on('first', function(queue) {
//     startGame(queue);
// });



socket.on('restart', function(queue) {
    restartGame(queue);
});

socket.on('reset', function() {
    endGame();
});

socket.on('pausePractice', function(data) {
    clearTimeout(firstPlayer.timeout);
    paused = true;
});

socket.on('unpausePractice', function(data) {
    firstPlayer.drawBoat();
    paused = false;
});

socket.on('pauseGame', function(data) {
    pauseGame();
});

socket.on('unpauseGame', function(data) {
    firstPlayer.drawBoat();
});

socket.on('startPractice', function (data) {
    if (!inPractice) {
		startPractice(data);
	} else {
		firstPlayer.drawBoat();
	};
});

socket.on('incomingBlocks', function(blocks) {
    firstPlayer.receiveBlocks(blocks.number);
});

socket.on('boat', function(sent) {
    opponent.drawBoat(sent);
});

socket.on('waiting', function(sent) {
    opponent.drawWaiting(sent);
});

socket.on('grid', function(sent) {
    opponent.drawGrid(sent);
});


socket.on('message', function(data) {
    console.log(data.message);
});

socket.on('alert', function(data) {
    console.log(data.message);
});
