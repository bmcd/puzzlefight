//Canvas Variables
//var gridCanvas = document.getElementById("grid");
//var gridContext = gridCanvas.getContext('2d');
//var waitingCanvas = document.getElementById("waiting");
//var waitingContext = waitingCanvas.getContext('2d');

//Starts the game
//window.onload = function() {
    //setInterval(firstPlayer.drawEverything, 33);
    //setInterval(secondPlayer.drawEverything, 33);
    //firstPlayer.clearGrid();
//};
opponent = new Opponent('B');
firstPlayer = new Opponent('A');
secondPlayer = new Opponent('B');

$(document).ready(function() {
	$(".auto-join").on("click", function(event) {
		$(this).html("Joining...");
		$(this).off("click");
		socket.emit("autoJoin", {});
	});
})