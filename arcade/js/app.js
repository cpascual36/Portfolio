var score =0;

//Create function to draw score on the board
function drawScore() {
    ctx.font = "22px Arial";
    ctx.fillstyle = 'black';
    ctx.fillText("Score: "+score, 410, 85);
}

// Enemies our player must avoid
var Enemy = function(x,y) {
    this.x = x;
    this.y = y;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// You should multiply any movement by the dt parameter
// which will ensure the game runs at the same speed for
// all computers.
Enemy.prototype.update = function(dt) {
// If the enemy's x-coordinate puts it off the board to the right,
// meaning it has completed its trek from left to right, reset the
// x-coordinate to a negative number to restart the enemy across the board from
// left to right again, ensuring an endless parade of enemies.
    this.speed = Math.random() * 350 + 1;
    this.x += this.speed * dt;
    if(this.x > 505) {
        this.x = Math.random() - 600;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Instantiate 7 enemy objects and place them in an array called allEnemies.
// X-cordinates are staggered to ensure no large gaps where there
// are no enemies on the board.
var enemy1 = new Enemy(-150, 50);
var enemy2 = new Enemy(-475, 50);
var enemy3 = new Enemy(-100, 145);
var enemy4 = new Enemy(-250, 145);
var enemy5 = new Enemy(-750, 145);
var enemy6 = new Enemy(-275, 225);
var enemy7 = new Enemy(-525, 225);

var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7];
var allEnemiesLength = allEnemies.length;

// Create player class. Set the initial location at center bottom of board.
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y) {
    this.sprite = 'images/char-boy.png';
    this.x = 505/2 -50;
    this.y = 380;
};

// Update the player's position, required method for game
Player.prototype.update = function() {
    this.collisionCheck();
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Place the player object in a variable called player
var player = new Player();

// Check for player-bug collisions. A collision will be detected when the player
// and bug overlap by half a column width or half a row height.
// Set score to zero because collision means game over.
Player.prototype.collisionCheck = function() {
    for (var i = 0; i < allEnemiesLength; i++) {
        if (this.x < (allEnemies[i].x + 50) &&
            (this.x + 50) > allEnemies[i].x &&
            this.y < (allEnemies[i].y + 40) &&
            (40 + this.y) > allEnemies[i].y) {
            this.resetGame();
            score = 0;
        }
    }
};

// When a key is pressed move player in the desired direction if it is within the board's boundaries.
// If moving the player in desired direction would cause the player to leave the board then do nothing.
// Columns (left/right movement) are predefined in the engine as 101, rows (up/down movement) at 83.
// Move up by subtracting 83 from current position on the y axis, down by adding 83 to current position on y axis.
// Move left by subtracting 101 from current position on x axis, right by adding 101.
// When the player is directed up into the water, add 1 to the score and start player at beginning to try again.
Player.prototype.handleInput = function(keyInput) {
    if(keyInput === 'up') {
        if(this.y < 83) {
            score ++;
            this.resetGame();
        }
        else {
           this.y -= 83;
        }
    }
    else if(keyInput === 'down') {
        if(this.y > 350) {
            return null;
        }
        else {
           this.y += 83;
        }
    }
    else if(keyInput === 'left') {
        if(this.x < 100) {
            return null;
        }
        else {
           this.x -= 101;
        }
    }
    else if(keyInput === 'right') {
        if(this.x > 400) {
            return null;
        }
        else {
           this.x += 101;
        }
    }
};


// Reset the game if player collides with a bug.
Player.prototype.resetGame = function() {
    this.x = 505/2 -50;
    this.y = 380;
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
