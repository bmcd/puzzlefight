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
    //roundContext.beginPath();
    //roundContext.arc(15, 15, 10, 0, 2 * Math.PI, false);
    roundContext.fillStyle = 'black';
    roundContext.fillRect(6, 0, 40, 20);
    roundContext.fillRect(roundCanvas.width - 46, 0, 40, 20);
    roundContext.fill();
    if (firstPlayerRounds > 0) {
        roundContext.fillStyle = '#A00000';
        roundContext.fillRect(6, 0, 20, 20);
        roundContext.fill();
    }
    //roundContext.strokeStyle = 'gray';
    //roundContext.stroke();
    //roundContext.closePath();
    //roundContext.beginPath();
    //roundContext.arc(37, 15, 10, 0, 2 * Math.PI, false);
    
    if (firstPlayerRounds > 1) {
        roundContext.fillStyle = '#A00000';
        roundContext.fillRect(6, 0, 40, 20);
        roundContext.fill();
    }
    //roundContext.stroke();
    //roundContext.closePath();
    //roundContext.beginPath();
    //roundContext.arc(roundCanvas.width - 15, 15, 10, 0, 2 * Math.PI, false);
    if (secondPlayerRounds > 0) {
        roundContext.fillStyle = '#A00000';
        roundContext.fillRect(roundCanvas.width - 26, 0, 20, 20);
        roundContext.fill();
    }
    //roundContext.stroke();
    //roundContext.closePath();
    //roundContext.beginPath();
    //roundContext.arc(roundCanvas.width - 37, 15, 10, 0, 2 * Math.PI, false);
    if (secondPlayerRounds > 1) {
        roundContext.fillStyle = '#A00000';
        roundContext.fillRect(roundCanvas.width - 46, 0, 40, 20);
        roundContext.fill();
    }
    //roundContext.stroke();
    //roundContext.closePath();
    roundContext.lineWidth = 1;
    
};

var startPractice = function(data) {
    console.log("starting practice");
    drawRounds();
    inPractice = true;
    theQueue = new Queue(data.practiceQueue.queue);
    firstPlayer = new Practice('A', 0, 0);
    //secondPlayer = new Board('B', 0, 0);
    opponent = new Opponent('B');
    firstPlayer.startGame();
    //secondPlayer.startGame();
};
var startGame = function(queue) {
    //var aPoints = firstPlayer.points;
    //var aSuper = firstPlayer.superMeter;
    //var bPoints = secondPlayer.points;
    //var bSuper = secondPlayer.superMeter;
    inPractice = false;
    paused = false;
    firstPlayerRounds = 0;
    secondPlayerRounds = 0;
    if (playerNumber == 0) {
        firstPlayerWins = queue.firstPlayerWins;
        secondPlayerWins = queue.secondPlayerWins;
    } else {
        firstPlayerWins = queue.secondPlayerWins;
        secondPlayerWins = queue.firstPlayerWins;
    };
    drawRounds();
    theQueue = new Queue(queue.queue);
    firstPlayer = new Board('A', 0, 0);
    //secondPlayer = new Board('B', 0, 0);
    opponent = new Opponent('B');
    setTimeout(function() { firstPlayer.startGame(); }, 3000);
    //secondPlayer.startGame();
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
    setTimeout(function() { firstPlayer.startGame(); }, 5000);
    //secondPlayer.startGame();
};
var startSpectating = function(data) {
    firstPlayerRounds = data.firstPlayerRounds;
    secondPlayerRounds = data.secondPlayerRounds;
    firstPlayerWins = data.firstPlayerWins;
    secondPlayerWins = data.secondPlayerWins;
    theQueue = new Queue(data.queue);
    drawRounds();
};


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
var whiteBlock = new Image();
whiteBlock.src = "images/whiteBlock.png";
var redBlock = new Image();
redBlock.src = "images/redBlock.png";
var blueBlock = new Image();
blueBlock.src = "images/blueBlock.png";
var greenBlock = new Image();
greenBlock.src = "images/greenBlock.png";
var yellowBlock = new Image();
yellowBlock.src = "images/yellowBlock.png";
var redBreaker = new Image();
redBreaker.src = "images/redBreaker.png";
var blueBreaker = new Image();
blueBreaker.src = "images/blueBreaker.png";
var greenBreaker = new Image();
greenBreaker.src = "images/greenBreaker.png";
var yellowBreaker = new Image();
yellowBreaker.src = "images/yellowBreaker.png";
var bombBomb = new Image();
bombBomb.src = "images/nuke.png";

//window.addEventListener("blur", function(event) { socket.emit('tab', { practice: inPractice, paused: paused }); }, false);

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 32:
            socket.emit('pause', { practice: inPractice, paused: paused });
            break;
        case 13:
            if (inPractice) { 
                firstPlayer.changeReady(!ready);
                socket.emit('ready', { ready: ready }); 
            };
            break;
        case 37:
            firstPlayer.leftArrowPressed();
            break;
        case 38:
            firstPlayer.upArrowPressed();
            break;
        case 39:
            firstPlayer.rightArrowPressed();
            break;
        case 66:
            firstPlayer.useSuper();
            break;
        case 78:
            firstPlayer.sKeyPressed();
            break;
        case 77:
            firstPlayer.dKeyPressed();
            break;
        case 40:
            firstPlayer.downArrowPressed();
            break;
    }
};

document.onkeyup = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 40:
            firstPlayer.downArrowReleased();
            break;
    }
};

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
        return this.grid[row][column].breaker == 'Breaker';
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
        this.grid[row][column] = new Block('white', 'Block');
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
        this.context.beginPath();
        this.context.moveTo(0, 50);
        this.context.lineTo(320, 50);
        this.context.strokeStyle = warningLine;
        this.context.lineWidth = 2;
        this.context.stroke();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.canvas.height);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        this.context.lineTo(this.canvas.width, 0);
        this.context.lineTo(0, 0);
        this.context.strokeStyle = '#000000';
        this.context.stroke();
        for (i = 1; i < 16; i++) {
            for (j = 1; j < 9; j++) {
                if (this.isNotNull(i, j)) {
                    this.context.drawImage(window[this.getColor(i, j) + this.getBreaker(i, j)], (j - 1) * 40, 530 - i * 40);
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
            this.waitingContext.drawImage(window[theQueue.getNextColor(this.count + 3) + theQueue.getNextBreaker(this.count + 3)], 0, 40);
            this.waitingContext.drawImage(window[theQueue.getNextColor(this.count + 2) + theQueue.getNextBreaker(this.count + 2)], 0, 80);
            this.waitingContext.font = "bold 14px sans-serif";
            this.waitingContext.fill();
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText('Points', 0, 160);
            this.waitingContext.fillText(this.points, 0, 180);
            this.waitingContext.fill();
            this.waitingContext.fillStyle = '#F39C12';
            this.waitingContext.fillRect(2, 380 - 180 * (this.superMeter / superMax) , 15, 180 * (this.superMeter / superMax));
            this.waitingContext.fill();
            this.waitingContext.lineWidth = 3;
            this.waitingContext.strokeRect(2, 200, 15, 180);
            this.waitingContext.stroke();
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText(this.message, 0, 460);
            if (firstPlayerWins > 0) { this.waitingContext.fillText('WINS: ' + firstPlayerWins, 0, 560); };
            this.waitingContext.fillText('S', 4, 230);
            this.waitingContext.fillText('U', 4, 260);
            this.waitingContext.fillText('P', 4, 290);
            this.waitingContext.fillText('E', 4, 320);
            this.waitingContext.fillText('R', 4, 350);
        } else {
            this.waitingContext.fillStyle = 'black';
            this.waitingContext.lineWidth = 1;
            this.waitingContext.drawImage(window[theQueue.getNextColor(this.count + 3) + theQueue.getNextBreaker(this.count + 3)], this.waitingCanvas.width - 40, 40);
            this.waitingContext.drawImage(window[theQueue.getNextColor(this.count + 2) + theQueue.getNextBreaker(this.count + 2)], this.waitingCanvas.width - 40, 80);
            this.waitingContext.font = "bold 14px sans-serif";
            this.waitingContext.textAlign = 'right';
            this.waitingContext.fill();
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText('Points', this.waitingCanvas.width, 160);
            this.waitingContext.fillText(this.points, this.waitingCanvas.width, 180);
            this.waitingContext.fill();
            this.waitingContext.fillStyle = '#F39C12';
            this.waitingContext.fillRect(this.waitingCanvas.width - 17, 380 - 180 * (this.superMeter / superMax) , 15, 180 * (this.superMeter / superMax));
            this.waitingContext.fill();
            this.waitingContext.lineWidth = 3;
            this.waitingContext.strokeRect(this.waitingCanvas.width - 17, 200, 15, 180);
            this.waitingContext.stroke();
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText(this.message, this.waitingCanvas.width, 460);
            if (secondPlayerWins > 0) { this.waitingContext.fillText('WINS: ' + secondPlayerWins, this.waitingCanvas.width, 560); };
            this.waitingContext.fillText('S', this.waitingCanvas.width - 6, 230);
            this.waitingContext.fillText('U', this.waitingCanvas.width - 6, 260);
            this.waitingContext.fillText('P', this.waitingCanvas.width - 6, 290);
            this.waitingContext.fillText('E', this.waitingCanvas.width - 6, 320);
            this.waitingContext.fillText('R', this.waitingCanvas.width - 6, 350);
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
        this.waitingToFall = sentBoat.waitingToFall;
        this.boatContext.clearRect(0, 0, this.boatCanvas.width, this.boatCanvas.height);
        this.boatContext.drawImage(window[sentBoat.bottomArray[0] + sentBoat.bottomArray[1]], sentBoat.bottomArray[2], sentBoat.bottomArray[3]);
        this.boatContext.drawImage(window[sentBoat.topArray[0] + sentBoat.topArray[1]], sentBoat.topArray[2], sentBoat.topArray[3]);
        if (this.waitingToFall > 0) {
            this.boatContext.font = "bold 18px sans-serif";
            this.boatContext.fillStyle = '#FFFFFF';
            this.boatContext.textAlign = 'center';
            this.boatContext.fillText("WARNING: " + this.waitingToFall + " BLOCKS INCOMING", this.boatCanvas.width / 2, 50);
        }
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
        this.grid[0][i] = new Block('wall', 'Block');
        this.grid[16][i] = new Block('wall', 'Block');
    }
    for (i = 1; i < 17; i++) {
        this.grid[i][0] = new Block('wall', 'Block');
        this.grid[i][9] = new Block('wall', 'Block');
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
        return this.grid[row][column].breaker == 'Breaker';
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
        this.grid[row][column] = new Block('white', 'Block');
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
            this.doubleBomb();
        }
    };
    //Draw the placed blocks
    this.drawGrid = function() {
        var i, j;
        this.context.beginPath();
        this.context.moveTo(0, 50);
        this.context.lineTo(320, 50);
        this.context.strokeStyle = warningLine;
        this.context.lineWidth = 2;
        this.context.stroke();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.canvas.height);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        this.context.lineTo(this.canvas.width, 0);
        this.context.lineTo(0, 0);
        this.context.strokeStyle = '#000000';
        this.context.stroke();
        socket.emit('grid', { grid: firstPlayer.grid, playerNumber: playerNumber });
        for (i = 1; i < 16; i++) {
            for (j = 1; j < 9; j++) {
                if (this.isNotNull(i, j)) {
                    this.context.drawImage(window[this.getColor(i, j) + this.getBreaker(i, j)], (j - 1) * 40, 530 - i * 40);
                }
            }
        }
    };

    //Draw the sidebar
    this.drawWaiting = function() {
        if (this.superMeter >= superMax) {
            this.superMeter = superMax;
            this.superReady = true;
        }
        this.waitingContext.clearRect(0, 0, this.waitingCanvas.width, this.waitingCanvas.height);
        socket.emit('waiting', { count: this.count, points: this.points, message: this.message, superMeter: this.superMeter, playerNumber: playerNumber });
            this.waitingContext.fillStyle = 'black';
            this.waitingContext.lineWidth = 1;
            this.waitingContext.drawImage(window[theQueue.getNextColor(this.count + 3) + theQueue.getNextBreaker(this.count + 3)], 0, 40);
            this.waitingContext.drawImage(window[theQueue.getNextColor(this.count + 2) + theQueue.getNextBreaker(this.count + 2)], 0, 80);
            this.waitingContext.font = "bold 14px sans-serif";
            this.waitingContext.fill();
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText('Points', 0, 160);
            this.waitingContext.fillText(this.points, 0, 180);
            this.waitingContext.fill();
            this.waitingContext.fillStyle = '#F39C12';
            this.waitingContext.fillRect(2, 380 - 180 * (this.superMeter / superMax) , 15, 180 * (this.superMeter / superMax));
            this.waitingContext.fill();
            this.waitingContext.lineWidth = 3;
            this.waitingContext.strokeRect(2, 200, 15, 180);
            this.waitingContext.stroke();
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText(this.message, 0, 460);
            if (firstPlayerWins > 0) { this.waitingContext.fillText('WINS: ' + firstPlayerWins, 0, 560); };
            this.waitingContext.fillText('S', 4, 230);
            this.waitingContext.fillText('U', 4, 260);
            this.waitingContext.fillText('P', 4, 290);
            this.waitingContext.fillText('E', 4, 320);
            this.waitingContext.fillText('R', 4, 350);
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
	            y = this.boat.positionY - 40;
	            break;
	        case 'left':
	            x = this.boat.positionX - 40;
	            y = this.boat.positionY;
	            break;
	        case 'down':
	            x = this.boat.positionX;
	            y = this.boat.positionY + 40;
	            break;
	        case 'right':
	            x = this.boat.positionX + 40;
	            y = this.boat.positionY;
	            break;
	    }
	    var bottomImage = window[this.boat.getBottomColor() + this.boat.getBottomBreaker()];
	    var topImage = window[this.boat.getTopColor() + this.boat.getTopBreaker()]
	    var topColor = this.boat.getTopColor();
	    var topBreaker = this.boat.getTopBreaker();
	    var bottomColor = this.boat.getBottomColor();
	    var bottomBreaker = this.boat.getBottomBreaker();
	    var sendX = this.boat.positionX;
	    var sendY = this.boat.positionY;
	    var sendWaiting = this.waitingToFall;
	    socket.emit('boat', { bottomArray: [bottomColor, bottomBreaker, sendX, sendY], topArray: [topColor, topBreaker, x, y], waitingToFall: sendWaiting, playerNumber: playerNumber });
        this.boatContext.clearRect(0, 0, this.boatCanvas.width, this.boatCanvas.height);
        this.boatContext.drawImage(bottomImage, this.boat.positionX, this.boat.positionY);
        this.boatContext.drawImage(topImage, x, y);
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
        this.drawWaiting();
        //this.interval = this.startAnimator();
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
        for (i = 1; i < 9; i++) {
            if (this.isNotNull(1, i)) {
                bonus = false;        
            }
        }
        if (bonus) {
            this.message = 'Clear Bonus';
            this.superMeter += superMax / 4;
        };
    };
    this.checkGravity = function() {
        var j;
        for (j = 1; j < 9; j++) {
            this.consolidateColumn(j);
        }
        this.clearGrid();
        //var inst = this;
        //this.timeout = setTimeout(function() { inst.checkBreakers(); }, gravityDelay);
        this.checkBreakers();
    };
    this.checkGravityWithPause = function() {
        var j;
        for (j = 1; j < 9; j++) {
            this.consolidateColumn(j);
        }
        this.clearGrid();
        var inst = this;
        this.timeout = setTimeout(function() { inst.checkBreakers(); }, gravityDelay);
    };
    this.consolidateColumn = function(column) {
        var i;
        var tempList = [];
        for (i = 1; i < 15; i++) {
            if (this.isNotNull(i, column)) {
                tempList.push(this.getBlock(i, column));
            }
        }
        if (tempList.length > 0) {
            for (i = 1; i < 15; i++) {
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
        for (i = 1; i < 9; i++) {
            if (this.isNotNull(13, i)) {
                end = true;        
            }
        }
        if (end) {
            this.message = "You lose ";
            this.drawWaiting();
            this.clearGrid();
            socket.emit('lost', {});
        } else {
            this.count += 2;
            this.boat.reset(this.count);
            this.drawWaiting();
            this.startAnimator();
        }
    };

    this.checkBomb = function(color) {
        var i, j;
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
                if (this.isNotNull(i, j) && this.isColor(i, j, color)) {
                    this.makeFlash(i, j);
                    this.points += 100;
                }
            }
        }
        this.pointMultiplier = 1;
        //this.checkGravity();
    };
    this.checkBombNoPoints = function(color) {
        var i, j;
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
                if (this.isNotNull(i, j) && this.isColor(i, j, color)) {
                    this.makeFlash(i, j);
                }
            }
        }
        this.pointMultiplier = 1;
        //this.checkGravity();
    };
    this.clearFlash = function() {
        var i, j;
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
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
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
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
            //this.checkGravity();
        } else {
            var inst = this;
            this.waitingToSend = Math.floor(this.waitingToSend * this.blockMultiplier);
            if (this.waitingToSend > 0) {
                sendBlocks(this.waitingToSend);
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
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
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
            for (i = 1; i < 15; i++) {
                for (j = 1; j < 9; j++) {
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
        //clearTimeout(this.interval);
        //this.dropBoat();
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
            this.boat.positionX -= 40;
        }
    };
    this.right = function() {
        if (this.checkRight()) {
            this.boat.column += 1;
            this.boat.topColumn += 1;
            this.boat.positionX += 40;
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
        for (i = 1; i < 14; i++) {
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
            if (two && this.isNull(i, 7)) {
                this.placeBlock(i, 7, createBomb());
                two = false;
                twoColor = this.getColor(i - 1, 7);
                twoRow = i;
                if (i == 1) {
                    this.message = "Bomb Bonus";
                    this.superMeter += superMax / 4;
                }
            }
        }
        this.makeNull(oneRow, 2);
        this.makeNull(twoRow, 7);
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

function Practice(name, carryover, meter) {
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
        this.grid[0][i] = new Block('wall', 'Block');
        this.grid[16][i] = new Block('wall', 'Block');
    }
    for (i = 1; i < 17; i++) {
        this.grid[i][0] = new Block('wall', 'Block');
        this.grid[i][9] = new Block('wall', 'Block');
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
        return this.grid[row][column].breaker == 'Breaker';
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
        this.grid[row][column] = new Block('white', 'Block');
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
            this.doubleBomb();
        }
    };
    //Draw the placed blocks
    this.drawGrid = function() {
        var i, j;
        //makes sure you can say ready at any time during practice mode
        notReady = true;
        this.context.beginPath();
        this.context.moveTo(0, 50);
        this.context.lineTo(320, 50);
        this.context.strokeStyle = warningLine;
        this.context.lineWidth = 2;
        this.context.stroke();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.canvas.height);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        this.context.lineTo(this.canvas.width, 0);
        this.context.lineTo(0, 0);
        this.context.strokeStyle = '#000000';
        this.context.stroke();
        socket.emit('grid', { grid: firstPlayer.grid, playerNumber: playerNumber });
        for (i = 1; i < 16; i++) {
            for (j = 1; j < 9; j++) {
                if (this.isNotNull(i, j)) {
                    this.context.drawImage(window[this.getColor(i, j) + this.getBreaker(i, j)], (j - 1) * 40, 530 - i * 40);
                }
            }
        }
    };

    //Draw the sidebar
    this.drawWaiting = function() {
        if (this.superMeter >= superMax) {
            this.superMeter = superMax;
            this.superReady = true;
        }
        this.waitingContext.clearRect(0, 0, this.waitingCanvas.width, this.waitingCanvas.height);
        socket.emit('waiting', { count: this.count, points: this.points, message: this.message, superMeter: this.superMeter, playerNumber: playerNumber });
            this.waitingContext.fillStyle = 'black';
            this.waitingContext.lineWidth = 1;
            this.waitingContext.drawImage(window[theQueue.getNextColor(this.count + 3) + theQueue.getNextBreaker(this.count + 3)], 0, 40);
            this.waitingContext.drawImage(window[theQueue.getNextColor(this.count + 2) + theQueue.getNextBreaker(this.count + 2)], 0, 80);
            this.waitingContext.font = "bold 14px sans-serif";
            this.waitingContext.fill();
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText('Points', 0, 160);
            this.waitingContext.fillText(this.points, 0, 180);
            this.waitingContext.fill();
            this.waitingContext.fillStyle = '#F39C12';
            this.waitingContext.fillRect(2, 380 - 180 * (this.superMeter / superMax) , 15, 180 * (this.superMeter / superMax));
            this.waitingContext.fill();
            this.waitingContext.lineWidth = 3;
            this.waitingContext.strokeRect(2, 200, 15, 180);
            this.waitingContext.stroke();
            this.waitingContext.fillStyle = 'white';
            this.waitingContext.fillText('PRACTICE MODE', 0, 450);
            this.waitingContext.fillText(this.message, 0, 470);
            this.waitingContext.fillText('S', 4, 230);
            this.waitingContext.fillText('U', 4, 260);
            this.waitingContext.fillText('P', 4, 290);
            this.waitingContext.fillText('E', 4, 320);
            this.waitingContext.fillText('R', 4, 350);
            
        
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
	            y = this.boat.positionY - 40;
	            break;
	        case 'left':
	            x = this.boat.positionX - 40;
	            y = this.boat.positionY;
	            break;
	        case 'down':
	            x = this.boat.positionX;
	            y = this.boat.positionY + 40;
	            break;
	        case 'right':
	            x = this.boat.positionX + 40;
	            y = this.boat.positionY;
	            break;
	    }
	    var bottomImage = window[this.boat.getBottomColor() + this.boat.getBottomBreaker()];
	    var topImage = window[this.boat.getTopColor() + this.boat.getTopBreaker()]
	    var topColor = this.boat.getTopColor();
	    var topBreaker = this.boat.getTopBreaker();
	    var bottomColor = this.boat.getBottomColor();
	    var bottomBreaker = this.boat.getBottomBreaker();
	    var sendX = this.boat.positionX;
	    var sendY = this.boat.positionY;
	    var sendWaiting = this.waitingToFall;
	    socket.emit('boat', { bottomArray: [bottomColor, bottomBreaker, sendX, sendY], topArray: [topColor, topBreaker, x, y], waitingToFall: sendWaiting, playerNumber: playerNumber });
        this.boatContext.clearRect(0, 0, this.boatCanvas.width, this.boatCanvas.height);
        this.boatContext.drawImage(bottomImage, this.boat.positionX, this.boat.positionY);
        this.boatContext.drawImage(topImage, x, y);
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
        this.message = 'PRESS ENTER';
        this.drawWaiting();
        //this.interval = this.startAnimator();
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
        for (i = 1; i < 9; i++) {
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
            this.message = 'PRESS ENTER';
        };
        this.drawWaiting();
    };
    this.checkGravity = function() {
        var j;
        for (j = 1; j < 9; j++) {
            this.consolidateColumn(j);
        }
        this.clearGrid();
        //var inst = this;
        //this.timeout = setTimeout(function() { inst.checkBreakers(); }, gravityDelay);
        this.checkBreakers();
    };
    this.checkGravityWithPause = function() {
        var j;
        for (j = 1; j < 9; j++) {
            this.consolidateColumn(j);
        }
        this.clearGrid();
        var inst = this;
        this.timeout = setTimeout(function() { inst.checkBreakers(); }, gravityDelay);
    };
    this.consolidateColumn = function(column) {
        var i;
        var tempList = [];
        for (i = 1; i < 15; i++) {
            if (this.isNotNull(i, column)) {
                tempList.push(this.getBlock(i, column));
            }
        }
        if (tempList.length > 0) {
            for (i = 1; i < 15; i++) {
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
        for (i = 1; i < 9; i++) {
            if (this.isNotNull(13, i)) {
                end = true;        
            }
        }
        if (end) {
            this.message = "You lose ";
            this.drawWaiting();
            this.clearGrid();
            socket.emit('lostPractice', {});
            inPractice = false;
        } else {
            this.count += 2;
            this.boat.reset(this.count);
            this.drawWaiting();
            this.startAnimator();
        }
    };

    this.checkBomb = function(color) {
        var i, j;
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
                if (this.isNotNull(i, j) && this.isColor(i, j, color)) {
                    this.makeFlash(i, j);
                    this.points += 100;
                }
            }
        }
        this.pointMultiplier = 1;
        //this.checkGravity();
    };
    this.checkBombNoPoints = function(color) {
        var i, j;
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
                if (this.isNotNull(i, j) && this.isColor(i, j, color)) {
                    this.makeFlash(i, j);
                }
            }
        }
        this.pointMultiplier = 1;
        //this.checkGravity();
    };
    this.clearFlash = function() {
        var i, j;
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
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
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
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
            //this.checkGravity();
        } else {
            this.waitingToSend = Math.floor(this.waitingToSend * this.blockMultiplier);
            if (ready) {
                this.message = 'READY!';
            } else {
                this.message = 'PRESS ENTER';
            };
            if (this.waitingToSend > 0) {
                //sendBlocks(this.waitingToSend);
                this.message = this.waitingToSend + ' blocks';
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
        for (i = 15; i > 0; i--) {
            for (j = 1; j < 9; j++) {
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
            for (i = 1; i < 15; i++) {
                for (j = 1; j < 9; j++) {
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
        //clearTimeout(this.interval);
        //this.dropBoat();
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
            this.boat.positionX -= 40;
        }
    };
    this.right = function() {
        if (this.checkRight()) {
            this.boat.column += 1;
            this.boat.topColumn += 1;
            this.boat.positionX += 40;
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
        for (i = 1; i < 14; i++) {
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
            if (two && this.isNull(i, 7)) {
                this.placeBlock(i, 7, createBomb());
                two = false;
                twoColor = this.getColor(i - 1, 7);
                twoRow = i;
                if (i == 1) {
                    this.message = "Bomb Bonus";
                    this.superMeter += superMax / 4;
                }
            }
        }
        this.makeNull(oneRow, 2);
        this.makeNull(twoRow, 7);
        this.checkBombNoPoints(oneColor);
        this.checkBombNoPoints(twoColor);
        this.clearGrid();
        var inst = this;
        this.timeout = setTimeout(function() { inst.clearFlash(); }, flashDelay);
    };
}