//ServerSide


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

var sendQueue = function() {
    queue = new Queue();
    return queue;
};

var restartTimer = function() {
    drawRounds();
    console.log(firstPlayerRounds + ' ' + secondPlayerRounds);
    if (firstPlayerRounds > numberRounds) {
        firstPlayerRounds = 0;
        secondPlayerRounds = 0;
        firstPlayerWins += 1;
        secondPlayerWins = 0;
        setTimeout(startGame, 5000);
    } else if (secondPlayerRounds > numberRounds) {
        firstPlayerRounds = 0;
        secondPlayerRounds = 0;
        firstPlayerWins = 0;
        secondPlayerWins += 1;
        setTimeout(startGame, 5000);
    } else {
        setTimeout(restartGame, 5000);
    }
};

var endGame = function(whoFrom) {
    clearTimeout(firstPlayer.timeout);
    if (whoFrom == 'A') {
        secondPlayerRounds += 1;
        secondPlayer.message = 'You Win!';
        secondPlayer.drawWaiting();
        clearTimeout(secondPlayer.timeout);
    } else {
        firstPlayerRounds += 1;
        firstPlayer.message = 'You Win!';
        firstPlayer.drawWaiting();
        clearTimeout(firstPlayer.timeout);
    }
    drawRounds();
    console.log(firstPlayerRounds + ' ' + secondPlayerRounds);
    if (firstPlayerRounds > numberRounds) {
        firstPlayerRounds = 0;
        secondPlayerRounds = 0;
        firstPlayerWins += 1;
        secondPlayerWins = 0;
        setTimeout(startGame, 5000);
    } else if (secondPlayerRounds > numberRounds) {
        firstPlayerRounds = 0;
        secondPlayerRounds = 0;
        firstPlayerWins = 0;
        secondPlayerWins += 1;
        setTimeout(startGame, 5000);
    } else {
        setTimeout(restartGame, 5000);
    }  
};