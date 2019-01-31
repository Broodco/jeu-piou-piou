// Start the game and refresh every 20ms

function startGame(){
    gameArea.start();
    gamePiece = new component(25,25,green,20,20);
}

function updateGameArea(){
    gameArea.clear();
    gamePiece.update();
}

// Create the canvas into the html body
// -- start : initialize the canvas and sets its attributes
// -- clear : clear everything from the canvas, used to prevent duplicates when refreshing the canvas

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.height = 600;
        this.canvas.width = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);},
    clear : function() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

// Create a component into the canvas
// This one is an example from w3schools - (a square)
// --update : called from the updateGameArea function, changes the element attributes

function component(width, height, color, x,y){
    this.width;
    this.height;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x , this.y , this.width, this.height);
    }
}