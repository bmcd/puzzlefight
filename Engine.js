//Drop rates

var paused = false;
var onePaused = false;
var twoPaused = false;
var ready = false;
var defaultSpeeds = [2, 24];
var gravityDelay = 400;
var flashDelay = 100;
var boatFPS = 33;
var message = 'Welcome!';
var carryPointsA = 0;
var carryPointsB = 0;
var superMax = 8000;
var theQueue;
var firstPlayer;
var secondPlayer;
var firstPlayerRounds = 0;
var secondPlayerRounds = 0;
var firstPlayerWins = 0;
var secondPlayerWins = 0;
var numberRounds = 1;
var roundCanvas;
var roundContext;
var opponent;
var inPractice = true;
var paused = false;
var warningLine = '#E67E22';
var safePause = true;
var playerNumber;
var spectating = false;
var blockLength = 40;
var startGameDelay = 3000;
var colors = ['#C0392B', '#2980B9', '#27AE60', '#F1C40F'];
var outlineColor = '#000000';
var rows = 12;
var columns = 8;
var pointsTextPer = 0.23;
var pointsPer = 0.25;
var superWidth = 8;
var messagePer = 0.65;
var winsPer = 0.8;
var waitingPad = 2 / 15;

var pauseGame = function() {
    if (safePause) {
	    clearTimeout(firstPlayer.timeout);
	    paused = true;
	} else {
	    setTimeout(pauseGame, 15);
	};
};
var drawRounds = function() {
    roundCanvas = document.getElementById('roundCanvas');
    roundContext = roundCanvas.getContext('2d');
    roundContext.clearRect(0, 0, roundCanvas.width, roundCanvas.height);
    roundContext.fillStyle = 'black';
    roundContext.fillRect(6, 0, 40, 20);
    roundContext.fillRect(roundCanvas.width - 46, 0, 40, 20);
    roundContext.fillStyle = '#A00000';
    if (firstPlayerRounds > 0) {
        roundContext.fillRect(6, 0, 20, 20);
    }
    if (firstPlayerRounds > 1) {
        roundContext.fillRect(6, 0, 40, 20);
    }
    if (secondPlayerRounds > 0) {
        roundContext.fillRect(roundCanvas.width - 26, 0, 20, 20);
    }
    if (secondPlayerRounds > 1) {
        roundContext.fillRect(roundCanvas.width - 46, 0, 40, 20);
    }

};

window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check;
}

var startTouch = function () {
	if (window.mobilecheck()) {
		upCanvas = document.getElementById("upCanvas");
		upContext = upCanvas.getContext("2d");
		//upCanvas.style.display='block';
		downCanvas = document.getElementById("downCanvas");
		downContext = downCanvas.getContext("2d");
		downCanvas.style.display='block';
		leftCanvas = document.getElementById("leftCanvas");
		leftContext = leftCanvas.getContext("2d");
		leftCanvas.style.display='block';
		rightCanvas = document.getElementById("rightCanvas");
		rightContext = rightCanvas.getContext("2d");
		rightCanvas.style.display='block';
		clockCanvas = document.getElementById("clockCanvas");
		clockContext = clockCanvas.getContext("2d");
		clockCanvas.style.display='block';
		counterCanvas = document.getElementById("counterCanvas");
		counterContext = counterCanvas.getContext("2d");
		counterCanvas.style.display='block';
		superCanvas = document.getElementById("superCanvas");
		superContext = superCanvas.getContext("2d");
		superCanvas.style.display='none';
		pauseCanvas = document.getElementById("pauseCanvas");
		pauseContext = pauseCanvas.getContext("2d");
		pauseCanvas.style.display='block';
		//upCanvas.addEventListener("touchend", function() { firstPlayer.upArrowPressed(); }, false);
		//downCanvas.addEventListener("touchstart", function() { firstPlayer.downArrowPressed(); }, false);
		downCanvas.addEventListener("touchend", function() { firstPlayer.upArrowPressed(); }, false);
		leftCanvas.addEventListener("touchend", function() { firstPlayer.leftArrowPressed(); }, false);
		rightCanvas.addEventListener("touchend", function() { firstPlayer.rightArrowPressed(); }, false);
		clockCanvas.addEventListener("touchend", function() { firstPlayer.dKeyPressed(); }, false);
		counterCanvas.addEventListener("touchend", function() { firstPlayer.sKeyPressed(); }, false);
		superCanvas.addEventListener("touchend", function() { firstPlayer.useSuper(); }, false);
		pauseCanvas.addEventListener("touchend", function() { socket.emit('pause', { practice: inPractice, paused: paused }); }, false);
		waitingCanvas = document.getElementById('playerAWaiting');
		waitingCanvas.addEventListener("touchend", function() {
			if (inPractice) {
            	firstPlayer.changeReady(!ready);
            	socket.emit('ready', { ready: ready });
    		}}, false);
    } else {
		pauseCanvas = document.getElementById("pauseCanvas");
		pauseContext = pauseCanvas.getContext("2d");
		pauseCanvas.style.display='block';
		pauseCanvas.addEventListener("mousedown", function() { socket.emit('pause', { practice: inPractice, paused: paused }); }, false);
		superCanvas = document.getElementById("superCanvas");
		superCanvas.addEventListener("mousedown", function() { firstPlayer.useSuper(); }, false);
		waitingCanvas = document.getElementById('playerAWaiting');
		waitingCanvas.addEventListener("mousedown", function() {
			if (inPractice) {
	            firstPlayer.changeReady(!ready);
	            socket.emit('ready', { ready: ready });
	        }}, false);
	}



}

var startPractice = function(gameData) {
	startTouch();
	drawRounds();
    inPractice = true;
    theQueue = new Queue(gameData.queue);
    firstPlayer = new Board('A', 0, 0);
    opponent = new Opponent('B');
	socket.emit('ready', { ready: true });
    firstPlayer.startGame();
};

var startGame = function(gameData) {
    inPractice = false;
    paused = false;
    firstPlayerRounds = 0;
    secondPlayerRounds = 0;
    if (playerNumber == 0) {
        firstPlayerWins = gameData.firstPlayerWins;
        secondPlayerWins = gameData.secondPlayerWins;
    } else {
        firstPlayerWins = gameData.secondPlayerWins;
        secondPlayerWins = gameData.firstPlayerWins;
    };
    drawRounds();
    theQueue = new Queue(gameData.queue);
    firstPlayer = new Board('A', 0, 0);
    opponent = new Opponent('B');
    setTimeout(function() { firstPlayer.startGame(); }, startGameDelay);
};

var restartGame = function(queue) {
    //var aPoints = firstPlayer.points;
    //var aSuper = firstPlayer.superMeter;
    //var bPoints = secondPlayer.points;
    //var bSuper = secondPlayer.superMeter;
    if (playerNumber == 0) {
        firstPlayerRounds = queue.firstPlayerRounds;
        secondPlayerRounds = queue.secondPlayerRounds;
    } else {
        firstPlayerRounds = queue.secondPlayerRounds;
        secondPlayerRounds = queue.firstPlayerRounds;
    };
    drawRounds();
    if (firstPlayer.superMeter == superMax) { firstPlayer.superMeter = 0 };
    theQueue = new Queue(queue.queue);
    firstPlayer = new Board('A', firstPlayer.points, firstPlayer.superMeter);
    //secondPlayer = new Board('B', secondPlayer.points, secondPlayer.superMeter);
    setTimeout(function() { firstPlayer.startGame(); }, startGameDelay);
    //secondPlayer.startGame();
};

// var startSpectating = function(data) {
//     firstPlayerRounds = data.firstPlayerRounds;
//     secondPlayerRounds = data.secondPlayerRounds;
//     firstPlayerWins = data.firstPlayerWins;
//     secondPlayerWins = data.secondPlayerWins;
//     theQueue = new Queue(data.queue);
//     drawRounds();
//     notifySpec();
// };

// var restartSpectating = function(data) {
//     firstPlayerRounds = data.firstPlayerRounds;
//     secondPlayerRounds = data.secondPlayerRounds;
//     firstPlayerWins = data.firstPlayerWins;
//     secondPlayerWins = data.secondPlayerWins;
//     theQueue = new Queue(data.queue);
//     drawRounds();
// };


var sendBlocks = function(blocks) {
    socket.emit('blocks', { number: blocks, playerNumber: playerNumber });
};
var endGame = function() {
    if (safePause) {
	    clearTimeout(firstPlayer.timeout);
	} else {
	    setTimeout(endGame, 15);
	};
};

//Import images
var bombBomb = new Image();
bombBomb.src = "images/nuke.png";

//window.addEventListener("blur", function(event) { socket.emit('tab', { practice: inPractice, paused: paused }); }, false);





document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 32: //space
            socket.emit('pause', { practice: inPractice, paused: paused });
            break;
        case 37: //left
            firstPlayer.leftArrowPressed();
            break;
        case 38: //up
            firstPlayer.upArrowPressed();
            break;
        case 39:  //right
            firstPlayer.rightArrowPressed();
            break;
        case 66: //b
            firstPlayer.useSuper();
            break;
        case 78: //n
            firstPlayer.sKeyPressed();
            break;
        case 77: //m
            firstPlayer.dKeyPressed();
            break;
        case 40: //down
            firstPlayer.downArrowPressed();
            break;
    }
};
document.onkeyup = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 40: //down
            firstPlayer.downArrowReleased();
            break;
    }
};

//Block Creation

//Picks random color. Returns color as a string.
var chooseColor = function() {
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



function Opponent(player) {
    this.grid = [];
    this.player = player;
    this.count = 0;
    this.drop = 0;
    //Point variables
    this.waitingToFall = 0;
    this.points = 0;
    this.superMeter = 0;
    this.message = " ";
    this.boat = {};
    this.canvas = document.getElementById('player' + this.player);
    this.context = this.canvas.getContext('2d');
    this.waitingCanvas = document.getElementById('player' + this.player + 'Waiting');
    this.waitingContext = this.waitingCanvas.getContext('2d');
    this.boatCanvas = document.getElementById('player' + this.player + 'Boat');
    this.boatContext = this.boatCanvas.getContext('2d');
    this.isNull = function(row, column) {
        return this.grid[row][column] == null;
    };
    this.isNotNull = function(row, column) {
        return this.grid[row][column] !== null;
    };
    this.isColor = function(row, column, incomingColor) {
        return this.grid[row][column].color == incomingColor;
    };
    this.getColor = function(row, column) {
        return this.grid[row][column].color;
    };
    this.isBreaker = function(row, column) {
        return this.grid[row][column].breaker;
    };
    this.getBreaker = function(row, column) {
        return this.grid[row][column].breaker;
    };
    this.isBomb = function(row, column) {
        return this.grid[row][column].breaker == 'Bomb';
    };
    this.makeNull = function(row, column) {
        this.grid[row][column] = null;
    };
    this.makeFlash = function(row, column) {
        this.grid[row][column] = new Block('white', false);
    };
    this.isNotFlash = function(row, column) {
        return this.grid[row][column].color !== 'white';
    };
    this.placeBlock = function(row, column, newBlock) {
        this.grid[row][column] = newBlock;
    };
    this.getBlock = function(row, column) {
        return this.grid[row][column];
    };
    //Draw the placed blocks
    this.drawGrid = function(sent) {
        this.clearGrid();
        this.grid = sent.grid;
        var i, j;
		console.log(this.grid);
        this.context.beginPath();
        this.context.moveTo(0, blockLength * 1.25);
        this.context.lineTo(this.canvas.width, blockLength * 1.25);
        this.context.strokeStyle = warningLine;
        this.context.lineWidth = 2;
        this.context.closePath();
        this.context.stroke();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.canvas.height);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        this.context.lineTo(this.canvas.width, 0);
        this.context.lineTo(0, 0);
        this.context.closePath();
        this.context.strokeStyle = outlineColor;
        this.context.stroke();
        for (i = 1; i < (rows + 4); i++) {
            for (j = 1; j < (columns + 1); j++) {
                if (this.isNotNull(i, j)) {
                    this.context.fillStyle = this.getColor(i, j);
                    if (this.getBreaker(i, j)) {
                        this.context.beginPath();
                        this.context.arc((j - 0.5) * blockLength, this.canvas.height - (i - 0.5) * blockLength, blockLength / 2.0, 0, Math.PI * 2, false);
                        this.context.closePath();
                        this.context.fill();
                    } else {
                        this.context.fillRect((j - 1) * blockLength, this.canvas.height - i * blockLength, blockLength, blockLength);
                    };
                }
            }
        }
    };

    //Draw the sidebar
    this.drawWaiting = function(sent) {
        this.count = sent.count;
        this.points = sent.points;
        this.message = sent.message;
        this.superMeter = sent.superMeter;
        this.waitingContext.clearRect(0, 0, this.waitingCanvas.width, this.waitingCanvas.height);
		if (this.player == "A") {
            this.waitingContext.fillStyle = 'black';
            this.waitingContext.lineWidth = 1;
            this.waitingContext.font = "bold 14px sans-serif";
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText('Points', waitingPad * this.waitingCanvas.width, this.waitingCanvas.height * pointsTextPer);
            this.waitingContext.fillText(this.points, waitingPad * this.waitingCanvas.width, this.waitingCanvas.height * pointsPer);
            this.waitingContext.fillStyle = '#F39C12';
            this.waitingContext.fillRect(0, this.canvas.height - this.canvas.height * (this.superMeter / superMax) , superWidth, this.canvas.height * (this.superMeter / superMax));
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText(this.message, waitingPad * this.waitingCanvas.width, this.waitingCanvas.height * messagePer);
            if (firstPlayerWins > 0) { this.waitingContext.fillText('WINS: ' + firstPlayerWins, waitingPad * this.waitingCanvas.width, this.waitingCanvas.height * winsPer); };
            var theColor = theQueue.getNextColor(this.count + 3);
            this.waitingContext.fillStyle = theColor;
                    if (theColor == 'bomb') {
                        this.waitingContext.drawImage(bombBomb, waitingPad * this.waitingCanvas.width, blockLength);
                    } else if (theQueue.getNextBreaker(this.count + 3)) {
                        this.waitingContext.beginPath();
                        this.waitingContext.arc((waitingPad * this.waitingCanvas.width) + blockLength * 0.5, blockLength * 1.5, blockLength * 0.5, 0, Math.PI * 2, false);
                        this.waitingContext.closePath();
                        this.waitingContext.fill();
                    } else {
                        this.waitingContext.fillRect(waitingPad * this.waitingCanvas.width, blockLength, blockLength, blockLength);
                    };
            theColor = theQueue.getNextColor(this.count + 2);
            this.waitingContext.fillStyle = theColor;
                    if (theColor == 'bomb') {
                        this.waitingContext.drawImage(bombBomb, waitingPad * this.waitingCanvas.width, blockLength * 2);
                    } else if (theQueue.getNextBreaker(this.count + 2)) {
                        this.waitingContext.beginPath();
                        this.waitingContext.arc((waitingPad * this.waitingCanvas.width) + blockLength * 0.5, blockLength * 2.5, blockLength * 0.5, 0, Math.PI * 2, false);
                        this.waitingContext.closePath();
                        this.waitingContext.fill();
                    } else {
                        this.waitingContext.fillRect(waitingPad * this.waitingCanvas.width, blockLength * 2, blockLength, blockLength);
                    };
        } else {
            this.waitingContext.fillStyle = 'black';
            this.waitingContext.lineWidth = 1;
            this.waitingContext.font = "bold 14px sans-serif";
            this.waitingContext.textAlign = 'right';
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText('Points', this.waitingCanvas.width - (waitingPad * this.waitingCanvas.width), this.waitingCanvas.height * pointsTextPer);
            this.waitingContext.fillText(this.points, this.waitingCanvas.width - (waitingPad * this.waitingCanvas.width), this.waitingCanvas.height * pointsPer);
            this.waitingContext.fillStyle = '#F39C12';
            this.waitingContext.fillRect(this.waitingCanvas.width - superWidth, this.canvas.height - this.canvas.height * (this.superMeter / superMax) , superWidth, this.canvas.height * (this.superMeter / superMax));
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText(this.message, this.waitingCanvas.width - (waitingPad * this.waitingCanvas.width), this.waitingCanvas.height * messagePer);
            if (secondPlayerWins > 0) { this.waitingContext.fillText('WINS: ' + secondPlayerWins, this.waitingCanvas.width - (waitingPad * this.waitingCanvas.width), this.waitingCanvas.height * winsPer); };
            var theColor = theQueue.getNextColor(this.count + 3);
            this.waitingContext.fillStyle = theColor;
                    if (theColor == 'bomb') {
                        this.waitingContext.drawImage(bombBomb, this.waitingCanvas.width - blockLength - (waitingPad * this.waitingCanvas.width), blockLength);
                    } else if (theQueue.getNextBreaker(this.count + 3)) {
                        this.waitingContext.beginPath();
                        this.waitingContext.arc(this.waitingCanvas.width - blockLength * 0.5 - (waitingPad * this.waitingCanvas.width), blockLength * 1.5, blockLength * 0.5, 0, Math.PI * 2, false);
                        this.waitingContext.closePath();
                        this.waitingContext.fill();
                    } else {
                        this.waitingContext.fillRect(this.waitingCanvas.width - blockLength - (waitingPad * this.waitingCanvas.width), blockLength, blockLength, blockLength);
                    };
            theColor = theQueue.getNextColor(this.count + 2);
            this.waitingContext.fillStyle = theColor;
                    if (theColor == 'bomb') {
                        this.waitingContext.drawImage(bombBomb, this.waitingCanvas.width - blockLength - (waitingPad * this.waitingCanvas.width), blockLength * 2);
                    } else if (theQueue.getNextBreaker(this.count + 2)) {
                        this.waitingContext.beginPath();
                        this.waitingContext.arc(this.waitingCanvas.width - blockLength * 0.5 - (waitingPad * this.waitingCanvas.width), blockLength * 2.5, blockLength * 0.5, 0, Math.PI * 2, false);
                        this.waitingContext.closePath();
                        this.waitingContext.fill();
                    } else {
                        this.waitingContext.fillRect(this.waitingCanvas.width - blockLength - (waitingPad * this.waitingCanvas.width), blockLength * 2, blockLength, blockLength);
                    };
        };
    };


    //Clears and redraws the grid
    this.clearGrid = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    this.clearBoat = function() {
        this.boatContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    this.drawBoat = function(sentBoat) {
        this.clearBoat();
        //this.boatContext.closePath();
        this.waitingToFall = sentBoat.waitingToFall;
        this.boatContext.clearRect(0, 0, this.boatCanvas.width, this.boatCanvas.height);
        var topColor = sentBoat.topArray[0];
	    var topBreaker = sentBoat.topArray[1];
	    var bottomColor = sentBoat.bottomArray[0];
	    var bottomBreaker = sentBoat.bottomArray[1];
	    this.boatContext.fillStyle = bottomColor;
        if (bottomBreaker) {
            this.boatContext.beginPath();
            this.boatContext.arc(sentBoat.bottomArray[2] + blockLength * 0.5, sentBoat.bottomArray[3] + blockLength * 0.5, blockLength / 2.0, 0, Math.PI * 2, false);
            this.boatContext.fill();
            this.boatContext.closePath();
                        //this.waitingContext.stroke();

        } else {
            this.boatContext.fillRect(sentBoat.bottomArray[2], sentBoat.bottomArray[3], blockLength, blockLength);
        };
        this.boatContext.fillStyle = topColor;
        if (topBreaker) {
            this.boatContext.beginPath();
            this.boatContext.arc(sentBoat.topArray[2] + blockLength * 0.5, sentBoat.topArray[3] + blockLength * 0.5, blockLength / 2.0, 0, Math.PI * 2, false);
            this.boatContext.fill();
            this.boatContext.closePath();
                        //this.waitingContext.stroke();

        } else {
            this.boatContext.fillRect(sentBoat.topArray[2], sentBoat.topArray[3], blockLength, blockLength);
        };
        //this.boatContext.drawImage(window[sentBoat.bottomArray[0] + sentBoat.bottomArray[1]], sentBoat.bottomArray[2], sentBoat.bottomArray[3]);
        //this.boatContext.drawImage(window[sentBoat.topArray[0] + sentBoat.topArray[1]], sentBoat.topArray[2], sentBoat.topArray[3]);
        if (this.waitingToFall > 0) {
            this.boatContext.font = "bold 18px sans-serif";
            this.boatContext.fillStyle = '#FFFFFF';
            this.boatContext.textAlign = 'center';
            this.boatContext.fillText("WARNING: " + this.waitingToFall + " BLOCKS INCOMING", this.boatCanvas.width / 2, 50);
        }
        //this.boatContext.closePath();
    };
};


//Board and Grid stuff

//Board object. Creates a 15 row by 10 column matrix of nulls and a wall around the left, bottom, right
function Board(name, carryover, meter) {
    this.grid = [];
    this.name = name;
    this.count = 0;
    this.drop = 0;
    this.message = " ";
    this.boat = new Boat();
    this.canvas = document.getElementById('player' +name);
    this.context = this.canvas.getContext('2d');
    this.waitingCanvas = document.getElementById('player' + this.name + "Waiting");
    this.waitingContext = this.waitingCanvas.getContext('2d');
    this.boatCanvas = document.getElementById('player' + this.name + "Boat");
    this.boatContext = this.boatCanvas.getContext('2d');
    //Point variables
    this.justBroken = 0;
    this.waitingToSend = 0;
    this.waitingToFall = 0;
    this.pointMultiplier = 1;
    this.blockMultiplier = 0.5;
    this.points = carryover;
    this.superMeter = meter;
    this.superReady = false;
    this.dropSpeed = defaultSpeeds[0];
    var i, j;
    for (i = 0; i < 17; i++) {
        this.grid[i] = [];
        for (j = 0; j < 10; j++) {
            this.grid[i][j] = null;
        }
    }
    for (i = 0; i < 10; i++) {
        this.grid[0][i] = new Block('wall', false);
        this.grid[16][i] = new Block('wall', false);
    }
    for (i = 1; i < 17; i++) {
        this.grid[i][0] = new Block('wall', false);
        this.grid[i][9] = new Block('wall', false);
    }
    this.isNull = function(row, column) {
        return this.grid[row][column] == null;
    };
    this.isNotNull = function(row, column) {
        return this.grid[row][column] !== null;
    };
    this.isColor = function(row, column, incomingColor) {
        return this.grid[row][column].color == incomingColor;
    };
    this.getColor = function(row, column) {
        return this.grid[row][column].color;
    };
    this.isBreaker = function(row, column) {
        return this.grid[row][column].breaker;
    };
    this.getBreaker = function(row, column) {
        return this.grid[row][column].breaker;
    };
    this.isBomb = function(row, column) {
        return this.grid[row][column].breaker == 'Bomb';
    };
    this.makeNull = function(row, column) {
        this.grid[row][column] = null;
    };
    this.makeFlash = function(row, column) {
        this.grid[row][column] = new Block('white', false);
    };
    this.isNotFlash = function(row, column) {
        return this.grid[row][column].color !== 'white';
    };
    this.placeBlock = function(row, column, newBlock) {
        this.grid[row][column] = newBlock;
    };
    this.getBlock = function(row, column) {
        return this.grid[row][column];
    };
    this.useSuper = function() {
        if (this.superReady) {
            this.superReady = false;
            this.superMeter = 0;
			superCanvas = document.getElementById("superCanvas");
			superCanvas.style.display='none';
            this.doubleBomb();
        }
    };
    //Draw the placed blocks
    this.drawGrid = function() {
        var i, j;
        if (inPractice) {
        	notReady = true;
        }
        this.context.beginPath();
        this.context.moveTo(0, blockLength * 1.25);
        this.context.lineTo(this.canvas.width, blockLength * 1.25);
        this.context.strokeStyle = warningLine;
        this.context.lineWidth = 2;
        this.context.closePath();
        this.context.stroke();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.canvas.height);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        this.context.lineTo(this.canvas.width, 0);
        this.context.lineTo(0, 0);
        this.context.closePath();
        this.context.strokeStyle = outlineColor;
        this.context.stroke();
		socket.emit('grid', { grid: firstPlayer.grid, playerNumber: playerNumber });
        for (i = 1; i < (rows + 4); i++) {
            for (j = 1; j < (columns + 1); j++) {
                if (this.isNotNull(i, j)) {
                    this.context.fillStyle = this.getColor(i, j);
                    if (this.getBreaker(i, j)) {
                        this.context.beginPath();
                        this.context.arc((j - 0.5) * blockLength, this.canvas.height - (i - 0.5) * blockLength, blockLength / 2.0, 0, Math.PI * 2, false);
                        this.context.closePath();
                        this.context.fill();
                    } else {
                        this.context.fillRect((j - 1) * blockLength, this.canvas.height - i * blockLength, blockLength, blockLength);
                    };
                }
            }
        }
    };

    //Draw the sidebar
    this.drawWaiting = function() {
        if (this.superMeter >= superMax) {
            this.superMeter = superMax;
            this.superReady = true;
			superCanvas = document.getElementById("superCanvas");
			superCanvas.style.display='block';
        }
        this.waitingContext.clearRect(0, 0, this.waitingCanvas.width, this.waitingCanvas.height);
        socket.emit('waiting', { count: this.count, points: this.points, message: this.message, superMeter: this.superMeter, playerNumber: playerNumber });
            this.waitingContext.fillStyle = 'black';
            this.waitingContext.lineWidth = 1;
            this.waitingContext.font = "bold 14px sans-serif";
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText('Points', waitingPad * this.waitingCanvas.width, this.waitingCanvas.height * pointsTextPer);
            this.waitingContext.fillText(this.points, waitingPad * this.waitingCanvas.width, this.waitingCanvas.height * pointsPer);
            this.waitingContext.fillStyle = '#F39C12';
            this.waitingContext.fillRect(0, this.canvas.height - this.canvas.height * (this.superMeter / superMax) , superWidth, this.canvas.height * (this.superMeter / superMax));
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText(this.message, waitingPad * this.waitingCanvas.width, this.waitingCanvas.height * messagePer);
            if (firstPlayerWins > 0) { this.waitingContext.fillText('WINS: ' + firstPlayerWins, waitingPad * this.waitingCanvas.width, this.waitingCanvas.height * winsPer); };
            var theColor = theQueue.getNextColor(this.count + 3);
            this.waitingContext.fillStyle = theColor;
                    if (theColor == 'bomb') {
                        this.waitingContext.drawImage(bombBomb, waitingPad * this.waitingCanvas.width, blockLength);
                    } else if (theQueue.getNextBreaker(this.count + 3)) {
                        this.waitingContext.beginPath();
                        this.waitingContext.arc((waitingPad * this.waitingCanvas.width) + blockLength * 0.5, blockLength * 1.5, blockLength * 0.5, 0, Math.PI * 2, false);
                        this.waitingContext.closePath();
                        this.waitingContext.fill();
                    } else {
                        this.waitingContext.fillRect(waitingPad * this.waitingCanvas.width, blockLength, blockLength, blockLength);
                    };
            theColor = theQueue.getNextColor(this.count + 2);
            this.waitingContext.fillStyle = theColor;
                    if (theColor == 'bomb') {
                        this.waitingContext.drawImage(bombBomb, waitingPad * this.waitingCanvas.width, blockLength * 2);
                    } else if (theQueue.getNextBreaker(this.count + 2)) {
                        this.waitingContext.beginPath();
                        this.waitingContext.arc((waitingPad * this.waitingCanvas.width) + blockLength * 0.5, blockLength * 2.5, blockLength * 0.5, 0, Math.PI * 2, false);
                        this.waitingContext.closePath();
                        this.waitingContext.fill();
                    } else {
                        this.waitingContext.fillRect(waitingPad * this.waitingCanvas.width, blockLength * 2, blockLength, blockLength);
                    };
    };

    //Clears and redraws the grid
    this.clearGrid = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    };
    this.clearBoat = function() {
        this.boatContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    //Draw the boat and check to
    this.drawBoat = function() {
        safePause = false;
        var x, y;
        switch (this.boat.state) {
            case 'up':
	            x = this.boat.positionX;
	            y = this.boat.positionY - blockLength;
	            break;
	        case 'left':
	            x = this.boat.positionX - blockLength;
	            y = this.boat.positionY;
	            break;
	        case 'down':
	            x = this.boat.positionX;
	            y = this.boat.positionY + blockLength;
	            break;
	        case 'right':
	            x = this.boat.positionX + blockLength;
	            y = this.boat.positionY;
	            break;
	    }
	    var topColor = this.boat.getTopColor();
	    var topBreaker = this.boat.getTopBreaker();
	    var bottomColor = this.boat.getBottomColor();
	    var bottomBreaker = this.boat.getBottomBreaker();
	    var sendX = this.boat.positionX;
	    var sendY = this.boat.positionY;
	    var sendWaiting = this.waitingToFall;
	    socket.emit('boat', { bottomArray: [bottomColor, bottomBreaker, sendX, sendY], topArray: [topColor, topBreaker, x, y], waitingToFall: sendWaiting, playerNumber: playerNumber });
        this.boatContext.clearRect(0, 0, this.boatCanvas.width, this.boatCanvas.height);
        this.boatContext.fillStyle = bottomColor;
            if (bottomColor == 'bomb') {
                this.boatContext.drawImage(bombBomb, this.boat.positionX, this.boat.positionY);
            } else if (bottomBreaker) {
            this.boatContext.beginPath();
            this.boatContext.arc(this.boat.positionX + blockLength * 0.5, this.boat.positionY + blockLength * 0.5, blockLength / 2.0, 0, Math.PI * 2, false);
            this.boatContext.closePath();
            this.boatContext.fill();
        } else {
            this.boatContext.fillRect(this.boat.positionX, this.boat.positionY, blockLength, blockLength);
        };
        this.boatContext.fillStyle = topColor;
        if (topColor == 'bomb') {
                this.boatContext.drawImage(bombBomb, x, y);
            } else if (topBreaker) {
            this.boatContext.beginPath();
            this.boatContext.arc(x + blockLength * 0.5, y + blockLength * 0.5, blockLength / 2.0, 0, Math.PI * 2, false);
            this.boatContext.closePath();
            this.boatContext.fill();
        } else {
            this.boatContext.fillRect(x, y, blockLength, blockLength);
        };
        if (this.waitingToFall > 0) {
            this.boatContext.font = "bold 18px sans-serif";
            this.boatContext.fillStyle = '#FFFFFF';
            this.boatContext.textAlign = 'center';
            this.boatContext.fillText("WARNING: " + this.waitingToFall + " BLOCKS INCOMING", this.boatCanvas.width / 2, 50);
        }
        this.boat.fall(this.dropSpeed);
        if (this.blockUnder()) {
            this.correctBoat();
            this.dropBoat();
        } else if (this.drop == 1) {
            this.drop = 0;
            this.dropBoat();
        } else {
            this.startAnimator();
        }
    };
    this.startGame = function() {
        this.boat.reset(this.count);
        this.clearGrid();
        if (inPractice) {
        	this.message = 'Click When Ready';
        }
		this.drawWaiting();
        this.drawBoat();
    };
    this.startAnimator = function() {
        var inst = this;
        this.timeout = setTimeout(function() { inst.drawBoat(); }, boatFPS);
        safePause = true;
    };
    this.checkClearBonus = function() {
        var bonus = true;
        var i;
        for (i = 1; i < (columns + 1); i++) {
            if (this.isNotNull(1, i)) {
                bonus = false;
            }
        }
        if (bonus) {
            this.message = 'Clear Bonus';
            this.superMeter += superMax / 4;
        };
    };
    this.changeReady = function(value) {
        ready = value;
        if (ready) {
            this.message = 'READY!';
        } else {
            this.message = 'Click When Ready';
        };
        this.drawWaiting();
    };
    this.checkGravity = function() {
        var j;
        for (j = 1; j < (columns + 1); j++) {
            this.consolidateColumn(j);
        }
        this.clearGrid();
        this.checkBreakers();
    };
    this.checkGravityWithPause = function() {
        var j;
        for (j = 1; j < (columns + 1); j++) {
            this.consolidateColumn(j);
        }
        this.clearGrid();
        var inst = this;
        this.timeout = setTimeout(function() { inst.checkBreakers(); }, gravityDelay);
    };
    this.consolidateColumn = function(column) {
        var i;
        var tempList = [];
        for (i = 1; i < (rows + 3); i++) {
            if (this.isNotNull(i, column)) {
                tempList.push(this.getBlock(i, column));
            }
        }
        if (tempList.length > 0) {
            for (i = 1; i < (rows + 3); i++) {
                if (tempList.length > 0) {
                    this.placeBlock(i, column, tempList.shift());
                } else {
                    this.makeNull(i, column);
                }
            }
        }
    };

    //Checks for blocks above the line, otherwise resets the boat
    this.newTurn = function() {
        var i, end;
        for (i = 1; i < (columns + 1); i++) {
            if (this.isNotNull(13, i)) {
                end = true;
            }
        }
        if (end) {
            this.message = "You lose ";
            this.drawWaiting();
            this.clearGrid();
            if (inPractice) {
            	socket.emit('lostPractice', {});
				inPractice = false;
            } else {
				socket.emit('lost', {});
			}
        } else {
            this.count += 2;
            this.boat.reset(this.count);
            this.drawWaiting();
            this.startAnimator();
        }
    };

    this.checkBomb = function(color) {
        var i, j;
        for (i = (rows + 3); i > 0; i--) {
            for (j = 1; j < (columns + 1); j++) {
                if (this.isNotNull(i, j) && this.isColor(i, j, color)) {
                    this.makeFlash(i, j);
                    this.points += 100;
                }
            }
        }
        this.pointMultiplier = 1;
    };
    this.checkBombNoPoints = function(color) {
        var i, j;
        for (i = (rows + 3); i > 0; i--) {
            for (j = 1; j < (columns + 1); j++) {
                if (this.isNotNull(i, j) && this.isColor(i, j, color)) {
                    this.makeFlash(i, j);
                }
            }
        }
        this.pointMultiplier = 1;
    };
    this.clearFlash = function() {
        var i, j;
        for (i = (rows + 3); i > 0; i--) {
            for (j = 1; j < (columns + 1); j++) {
                if (this.isNotNull(i, j) && this.isColor(i, j, 'white')) {
                    this.makeNull(i, j);
                }
            }
        }
        this.clearGrid();
        var inst = this;
        this.timeout = setTimeout(function() { inst.clearGrid(); inst.checkGravityWithPause(); }, flashDelay);
    };
    //Checks each space in the grid for breakers. Starts a break chain for each.
    this.checkBreakers = function() {
        var i, j;
        for (i = (rows + 3); i > 0; i--) {
            for (j = 1; j < (columns + 1); j++) {
                if (this.isNotNull(i, j) && this.isBreaker(i, j)) {
                    this.breakChain(i, j, this.getColor(i, j), true);
                }
            }
        }
        //checks to see if anything was broken so that it can loop back to checkGravity
        //Sets/resets multipliers and counters
        if (this.justBroken > 0) {
            this.waitingToSend += this.justBroken;
            this.points += this.justBroken * 100 * this.pointMultiplier;
            this.superMeter += this.justBroken * 100 * this.pointMultiplier;
            this.blockMultiplier += 0.5;
            this.pointMultiplier += 1;
            this.justBroken = 0;
            this.clearGrid();
            var inst = this;
            this.timeout = setTimeout(function() { inst.clearFlash(); }, flashDelay);
        } else {
            this.waitingToSend = Math.floor(this.waitingToSend * this.blockMultiplier);
            if (inPractice) {
	            if (ready) {
	                this.message = 'READY!';
	            } else {
	                this.message = 'Click When Ready';
	            };
            }
			if (this.waitingToSend > 0) {
                if (!inPractice) {
				    sendBlocks(this.waitingToSend);
				}
                this.message = this.waitingToSend;
            }
            if (this.pointMultiplier >= 3) {
                this.checkClearBonus();
            };
            this.blockMultiplier = 0.5;
            this.pointMultiplier = 1;
            this.justBroken = 0;
            this.waitingToSend = 0;
            this.checkForDrop();
        }
    };
    this.checkForBomb = function() {
        var i, j;
        for (i = (rows + 3); i > 0; i--) {
            for (j = 1; j < (columns + 1); j++) {
                if (this.isNotNull(i, j) && this.isBomb(i, j)) {
                    if (i === 1) {
                        this.message = 'Bomb Bonus';
                        this.superMeter += superMax / 4;
                        this.makeNull(i, j);
                        this.drawWaiting();
                    } else {
                        this.makeNull(i, j);
                        this.bombed = true;
                        this.checkBomb(this.getColor(i - 1, j));
                    }
                }
            }
        }
        if (this.bombed) {
            this.bombed = false;
            this.clearGrid();
            var inst = this;
            this.timeout = setTimeout(function() { inst.clearFlash(); }, flashDelay);
        } else {
            this.checkGravity();
        }
    };
    //Tests adjacent blocks and adds them to a list if they are the same color
    //The 'first' variable is t/f and tells whether or not this is the first in the chain
    this.breakChain = function(row, column, theColor, first) {
        var i;
        var sameColor = [];
        if (this.isNotNull(row + 1, column)) {
            if (this.isColor(row + 1, column, theColor)) {
                sameColor.push([row + 1, column]);
            }
        }
        if (this.isNotNull(row - 1, column)) {
            if (this.isColor(row - 1, column, theColor)) {
                sameColor.push([row - 1, column]);
            }
        }
        if (this.isNotNull(row, column + 1)) {
            if (this.isColor(row, column + 1, theColor)) {
                sameColor.push([row, column + 1]);
            }
        }
        if (this.isNotNull(row, column - 1)) {
            if (this.isColor(row, column - 1, theColor)) {
                sameColor.push([row, column - 1]);
            }
        }
        if (sameColor.length > 0) {
            this.makeFlash(row, column);
            this.justBroken += 1;
            for (i = 0; i < sameColor.length; i++) {
                if (this.isNotFlash(sameColor[i][0], sameColor[i][1])) {
                    this.breakChain(sameColor[i][0], sameColor[i][1], theColor, false);
                }
            }
        }
        if (first == false && this.isNotFlash(row, column)) {
            this.makeFlash(row, column);
            this.justBroken += 1;
        }
    };
    this.dropBottom = function() {
        for (i = this.boat.row; i > 0; i--) {
            if (this.isNotNull(i - 1, this.boat.column)) {
                this.placeBlock(i, this.boat.column, this.boat.boat[0]);
                break;
            }
        }
    };
    this.dropTop = function() {
        for (i = this.boat.topRow; i > 0; i--) {
            if (this.isNotNull(i - 1, this.boat.topColumn)) {
                this.placeBlock(i, this.boat.topColumn, this.boat.boat[1]);
                break;
            }
        }
    };
    this.correctBoat = function() {
        this.boat.row += 1;
        this.boat.topRow += 1;
    };
    this.dropBoat = function() {
        this.clearBoat();
        if (this.boat.state == 'down') {
            this.dropTop();
            this.dropBottom();
        } else {
            this.dropBottom();
            this.dropTop();
        }
        this.message = ' ';
        //this.waitingToSend = 0;
        //this.blockMultiplier = 0.5;
        //this.pointMultiplier = 1;
        this.checkForBomb();
    };
    this.checkForDrop = function() {
        if (this.waitingToFall > 0) {
            this.dropBlocks();
        } else {
            this.clearGrid();
            this.newTurn();
        }
    };
    this.dropBlocks = function () {
        var i, j;
        loop:
            for (i = 1; i < (rows + 3); i++) {
                for (j = 1; j < (columns + 1); j++) {
                    if (this.waitingToFall > 0 && this.isNull(i, j)) {
                        this.placeBlock(i, j, createBlockForFall());
                        this.waitingToFall -= 1;
                    }
                }
            }
        this.waitingToFall = 0;
        this.clearGrid();
        var inst = this;
        this.timeout = setTimeout(function() { inst.checkGravity(); }, gravityDelay);
        //this.checkGravity();
    };

    this.receiveBlocks = function(number) {
        this.waitingToFall += number;
    };
    this.leftArrowPressed = function() {
        this.left();
    };
    this.rightArrowPressed = function() {
        this.right();
    };
    this.upArrowPressed = function() {
        this.up();
    };
    this.downArrowPressed = function() {
        //this.stopAnimator();
        this.dropSpeed = defaultSpeeds[1];
    };
    this.downArrowReleased = function() {
        this.dropSpeed = defaultSpeeds[0];
    };
    this.sKeyPressed = function() {
        this.counterClock();
    };
    this.dKeyPressed = function() {
        this.clock();
    };
    //Checkers return true if the space is empty.
    this.checkLeft = function() {
        return this.isNull(this.boat.row, this.boat.column - 1) && this.isNull(this.boat.topRow, this.boat.topColumn - 1);
    };
    this.checkRight = function() {
        return this.isNull(this.boat.row, this.boat.column + 1) && this.isNull(this.boat.topRow, this.boat.topColumn + 1);
    };
    //Returns true if a block is under either boat block
    this.blockUnder = function() {
	    return this.isNotNull(this.boat.row, this.boat.column) || this.isNotNull(this.boat.topRow, this.boat.topColumn);
    };
    this.up = function() {
        this.drop = 1;
    };
    this.down = function() {
        this.boat.row -= 1;
        this.boat.topRow -= 1;
    };
    this.left = function() {
        if (this.checkLeft()) {
            this.boat.column -= 1;
            this.boat.topColumn -= 1;
            this.boat.positionX -= blockLength;
        }
    };
    this.right = function() {
        if (this.checkRight()) {
            this.boat.column += 1;
            this.boat.topColumn += 1;
            this.boat.positionX += blockLength;
        }
    };

    //Boat rotation
    this.counterClock = function() {
	    switch (this.boat.state) {
	        case 'up':
	            if (this.isNull(this.boat.row, this.boat.column - 1)) {
	                this.boat.topRow = this.boat.row;
	                this.boat.topColumn = this.boat.column - 1;
	                this.boat.state = 'left';
	            } else if (this.isNull(this.boat.row, this.boat.column + 1)) {
	                this.boat.topRow = this.boat.row;
	                this.boat.topColumn = this.boat.column + 1;
	                this.boat.state = 'right';
	            }
	            break;
	        case 'left':
	            if (this.isNull(this.boat.row - 1, this.boat.column)) {
	                this.boat.topRow = this.boat.row - 1;
	                this.boat.topColumn = this.boat.column;
	                this.boat.state = 'down';
	            } else if (this.isNull(this.boat.row + 1, this.boat.column)) {
	                this.boat.topRow = this.boat.row + 1;
	                this.boat.topColumn = this.boat.column;
	                this.boat.state = 'up';
	            }
	            break;
	        case 'down':
	            if (this.isNull(this.boat.row, this.boat.column + 1)) {
	                this.boat.topRow = this.boat.row;
	                this.boat.topColumn = this.boat.column + 1;
	                this.boat.state = 'right';
	            } else if (this.isNull(this.boat.row + 1, this.boat.column)) {
	                this.boat.topRow = this.boat.row + 1;
	                this.boat.topColumn = this.boat.column;
	                this.boat.state = 'up';
	            }
	            break;
	        case 'right':
	            if (this.isNull(this.boat.row + 1, this.boat.column)) {
	                this.boat.topRow = this.boat.row + 1;
	                this.boat.topColumn = this.boat.column;
	                this.boat.state = 'up';
	            }
	            break;
	    }
    };
    this.clock = function() {
	    switch (this.boat.state) {
	        case 'up':
	            if (this.isNull(this.boat.row, this.boat.column + 1)) {
	                this.boat.topRow = this.boat.row;
	                this.boat.topColumn = this.boat.column + 1;
	                this.boat.state = 'right';
	            } else if (this.isNull(this.boat.row - 1, this.boat.column)) {
	                this.boat.topRow = this.boat.row - 1;
	                this.boat.topColumn = this.boat.column;
	                this.boat.state = 'down';
	            }
	            break;
	        case 'left':
	            if (this.isNull(this.boat.row + 1, this.boat.column)) {
	                this.boat.topRow = this.boat.row + 1;
	                this.boat.topColumn = this.boat.column;
	                this.boat.state = 'up';
	            }
	            break;
	        case 'down':
	            if (this.isNull(this.boat.row, this.boat.column - 1)) {
	                this.boat.topRow = this.boat.row;
	                this.boat.topColumn = this.boat.column - 1;
	                this.boat.state = 'left';
	            } else if (this.isNull(this.boat.row + 1, this.boat.column)) {
	                this.boat.topRow = this.boat.row + 1;
	                this.boat.topColumn = this.boat.column;
	                this.boat.state = 'up';
	            }
	            break;
	        case 'right':
	            if (this.isNull(this.boat.row - 1, this.boat.column)) {
	                this.boat.topRow = this.boat.row - 1;
	                this.boat.topColumn = this.boat.column;
	                this.boat.state = 'down';
	            } else if (this.isNull(this.boat.row, this.boat.column - 1)) {
	                this.boat.topRow = this.boat.row;
	                this.boat.topColumn = this.boat.column - 1;
	                this.boat.state = 'left';
	            }
	            break;
	    }
    };
    this.doubleBomb = function() {
        var i;
        var one = true;
        var oneRow, twoRow, oneColor, twoColor;
        var two = true;
        clearTimeout(this.timeout);
        this.clearBoat();
        this.count -= 2;
        for (i = 1; i < (rows + 2); i++) {
            if (one && this.isNull(i, 2)) {
                this.placeBlock(i, 2, createBomb());
                one = false;
                oneColor = this.getColor(i - 1, 2);
                if (i == 1) {
                    this.message = "Bomb Bonus";
                    this.superMeter += superMax / 4;
                }
                oneRow = i;
            }
            if (two && this.isNull(i, (columns - 1))) {
                this.placeBlock(i, (columns - 1), createBomb());
                two = false;
                twoColor = this.getColor(i - 1, (columns - 1));
                twoRow = i;
                if (i == 1) {
                    this.message = "Bomb Bonus";
                    this.superMeter += superMax / 4;
                }
            }
        }
        this.makeNull(oneRow, 2);
        this.makeNull(twoRow, (columns - 1));
        this.checkBombNoPoints(oneColor);
        this.checkBombNoPoints(twoColor);
        this.clearGrid();
        var inst = this;
        this.timeout = setTimeout(function() { inst.clearFlash(); }, flashDelay);
    };
}




//The Boat

//The boat is the set of blocks that the player is controlling
//It has a top and bottom block and always rotates around the bottom
//State tells you the direction, row and column position
function Boat() {
    this.state = 'up';
    this.row = 13;
    this.column = 5;
    this.topRow = 14;
    this.topColumn = 5;
    this.positionX = 160;
    this.positionY = 0;
    this.boat = [null, null];
    this.reset = function(count) {
        this.state = 'up';
        this.row = 13;
        this.column = 5;
        this.topRow = 14;
        this.topColumn = 5;
        this.positionX = 160;
        this.positionY = 0;
        this.boat[0] = theQueue.getNextBlock(count);
        this.boat[1] = theQueue.getNextBlock(count + 1);
    };
    this.fall = function(speed) {
        this.positionY += speed;
        var difference = this.row - (13 - Math.floor((this.positionY + 4) / 40));
        if (difference > 0) {
            this.row -= difference;
            this.topRow -= difference;
        }
    };
    this.getBottomColor = function() {
        return this.boat[0].color;
    };
    this.getBottomBreaker = function() {
        return this.boat[0].breaker;
    };
    this.getTopColor = function() {
        return this.boat[1].color;
    };
    this.getTopBreaker = function() {
        return this.boat[1].breaker;
    };
    this.getBottomBlock = function() {
        return this.boat[0];
    };
    this.getTopBlock = function() {
        return this.boat[1];
    };
};

//The Queue
function Queue(sent) {
    this.queue = sent;
    this.getNextBlock = function(count) {
        return this.queue[count];
    };
    this.getNextColor = function(count) {
        return this.queue[count].color;
    };
    this.getNextBreaker = function(count) {
        return this.queue[count].breaker;
    };

};