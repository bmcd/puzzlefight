//ServerSide
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
function chooseColor() {
    var colors = ['#C0392B', '#2980B9', '#27AE60', '#F1C40F'];
    return colors[Math.floor(Math.random() * colors.length)];
};

//Decides if the block is a breaker based on breakerChance. Returns string 'Block' or 'Breaker'
function chooseBreaker() {
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
function createBlockForPlayer() {
    return new Block(chooseColor(), chooseBreaker());
};

//Block creator for fall (Breakers not possible)
function createBlockForFall() {
    return new Block(chooseColor(), false);
};

function createBomb() {
    return new Block('bomb', 'Bomb');
};

//The Queue
exports.Queue = function() {
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