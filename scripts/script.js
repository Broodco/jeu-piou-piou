// Starts the game
// Creates the player shaceship and the first target
// Also initialize shotexist, numshot et shotsfired, variables needed to create shots

function startGame(){
    document.querySelector(".splashScreen").style.display = "none";
    document.querySelector(".area").style.display = "block";
    gameArea.createCanvas();
    gameArea.start();
    shotexist = false;
    targetsCount = 0;
    numshot = 0;
    shotsfired = [];
    reload = 50;
    spaceship = new drawcomp(document.querySelector("#spaceship"),300,450,200,200);
    alien = new drawcomp(document.querySelector('#alien'),getRandomPosition()[0],getRandomPosition()[1],120,120);
}

function endGame(){

}

// Create the canvas into the html body
// -- start : initialize the canvas and sets its attributes
// -- start : also includes evenListeners changing the "key" property of the gameArea based on the key pressed by user.
// -- clear : clear everything from the canvas, used to prevent duplicates when refreshing the canvas

var gameArea = {
    canvas : document.createElement("canvas"),
    createCanvas : function(){
        this.canvas.height = 600;
        this.canvas.width = 800;
        this.canvas.style.background = "black";
        this.context = this.canvas.getContext("2d");
        document.querySelector(".area").insertBefore(this.canvas,document.querySelector(".area").childNodes[0]);},
    start : function(){
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e){
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup',function(e){
            gameArea.keys[e.keyCode] = false;
        })
    },
    clear : function() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
      }
}

// Create a random position within the canvas
// This is used to create a position for the alien

function getRandomPosition() {  
    var canvas = document.querySelector("canvas");
    var y = (canvas.height)-220;
    var x = (canvas.width)-120;   
    var randomX = Math.floor(Math.random()*x);
    var randomY = Math.floor(Math.random()*y);
    return [randomX,randomY];
}

// Create an image into the canvas
// --update is used to redraw the image every 20ms
// --newPos is used to refresh coordinates and change those if needed

function drawcomp(src,x,y,width,height){
    this.src = src;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.width = width;
    this.height= height;
    this.update = function(){
        ctx = gameArea.context;
        ctx.drawImage(this.src,this.x,this.y,this.width,this.height);
    }
    this.newPos = function(){
        this.x += this.speedX;
    }
    this.collision = function(laserObj){
        var a_left = this.x;
        var a_right = this.x + (this.width);
        var a_bottom = this.y + (this.height);
        var las_center = laserObj.x + 100;
        var las_top = laserObj.y;
        if ((a_bottom>=las_top) && (a_left <= las_center) && (a_right >= las_center)
        ){
            crash = true;
        }else{
            crash = false;
        }
        return crash;
    }
}

// Draw the laser shots image onto the canvas
// Different from the other because it takes no argument and we use the prototype to declare the newpos and update functions. This enables us to create multiple instances of the same object onto the canvas.

function drawshots(){
    this.src = document.querySelector('#shots');
    let xpos = spaceship.x;
    this.x = xpos;
    this.y = 480;
    this.speedX = 0;
    this.speedY = -10;
    this.width = 200;
    this.height = 25.86;
}

drawshots.prototype.newPos = function(){
    this.y += this.speedY;
}

drawshots.prototype.update = function(){
    ctx = gameArea.context;
    ctx.drawImage(this.src,this.x,this.y,this.width,this.height);
}

// Updates the game every 20ms

function updateGameArea(){
    gameArea.clear();
    spaceship.speedX = 0;
    reload--;
    if (targetsCount == 10){
        gameArea.stop();
        endGame();
    }
    if (gameArea.keys && gameArea.keys[37]){spaceship.speedX = -6}
    if (gameArea.keys && gameArea.keys[39]){spaceship.speedX = 6;}
    // Next block creates a laser shot if the reload time is under 0
    // Each shot is part of an array named shotsfired, this way we can have multiple shots on screen at the same time
    if (gameArea.keys && gameArea.keys[32] && reload <= 0){
        shotsfired = new drawshots();
        shotexist = true;
        reload = 50;
    }
    spaceship.newPos();
    spaceship.update();
    alien.update();
    // Updates the different shots only if there is one
    if (shotexist == true){
        shotsfired.newPos();
        shotsfired.update();
        if ((shotsfired.y) < 0){
            shotsfired = 0;
            shotexist = false;
            console.log("out")
        }
        // Checks if laser shots and the target are in the same place. If so, deletes both, specify that there's no current shot and recreates a target at a random position.
        else if (alien.collision(shotsfired)==true){
            targetsCount += 1;
            alien = 0;
            alien.x = getRandomPosition()[0];
            alien.y = getRandomPosition()[1];
            shotsfired = 0;
            shotexist = false;
            alien = new drawcomp(document.querySelector('#alien'),getRandomPosition()[0],getRandomPosition()[1],120,120);
        }
    }
}

