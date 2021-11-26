var WIDTH;
var HEIGHT;
var squareWidth;
var currentScene;
var currentDirection;
var snakeSquares;
var dotSquare;
var menuButtons;
var lossButtons;

function setup() {
  noStroke();
  textFont('PT Sans Caption');
  squareWidth = Math.floor(windowHeight/30);
  WIDTH = Math.floor(windowHeight/30) * 30;
  HEIGHT = Math.floor(windowHeight/30) * 30;
  currentDirection = "right";
  currentScene = "menu";
  lossButtons = [
    new Button(HEIGHT/5, HEIGHT/2 + HEIGHT/8, 3 * HEIGHT/5, HEIGHT/6, color(255), color(255,255,0), 'Restart', resetGame)
  ];
  menuButtons = [
    new Button(HEIGHT/5, HEIGHT/2, 3 * HEIGHT/5, HEIGHT/6, color(255), color(255,255,0), 'Start', resetGame)
  ];
  var canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('display-game');
}

function draw() {
  drawBackground();
  switch(currentScene){
    case "menu":
      drawStartMenu();
      break;
      
    case "game":
      drawSnake();
      Dot.displayDot();
      if(frameCount % 3 === 0)
        moveSnake();
      break;

    case "loss":
      drawLossMenu();
      break;
  }
}

function keyPressed() {
  
  switch(keyCode){
      
    case (LEFT_ARROW):
      if(currentDirection !== "right")
        currentDirection = "left";
      break;
    case (UP_ARROW):
      if(currentDirection !== "down")
        currentDirection = "up";
      break;
    case (RIGHT_ARROW):
      if(currentDirection !== "left")
        currentDirection = "right";
      break;
    case (DOWN_ARROW):
      if(currentDirection !== "up")
        currentDirection = "down";
      break;
      
  }

}

function drawBackground(){
  background(20);
}

function drawSnake(){
  for(let i=0; i<snakeSquares.length; i++){
    push();
    fill(0,255,0);
    square(squareWidth * snakeSquares[i][0], squareWidth * snakeSquares[i][1], squareWidth);
    pop();
  }
}

function moveSnake(){
  let head = snakeSquares.length - 1;
  let nextCoord;
  switch(currentDirection){
     
    case "left":
      nextCoord = [snakeSquares[head][0]-1, snakeSquares[head][1]];
      if(nextCoord[0] < 0)
        currentScene = "loss";
      break;
    case "right":
      nextCoord = [snakeSquares[head][0]+1, snakeSquares[head][1]];
      if(nextCoord[0] > 29)
        currentScene = "loss";
      break;
    case "up":
      nextCoord = [snakeSquares[head][0], snakeSquares[head][1]-1];
      if(nextCoord[1] < 0)
        currentScene = "loss";
      break;
    case "down":
      nextCoord = [snakeSquares[head][0], snakeSquares[head][1]+1];
      if(nextCoord[1] > 29)
        currentScene = "loss";
      break;
  }
  snakeSquares.push(nextCoord);
  if(!(nextCoord[0] === dotSquare[0] && nextCoord[1] === dotSquare[1]))
    snakeSquares.shift();
  else
    Dot.newDotSquare();
  for(let i=0; i<snakeSquares.length-1; i++){
    for(let j=i+1; j<snakeSquares.length; j++){
      if(snakeSquares[i][0] === snakeSquares[j][0] && snakeSquares[i][1] === snakeSquares[j][1])
        currentScene = "loss";
    }
  }

}

function drawStartMenu(){
  push();
  fill(0, 255, 0);
  textSize(HEIGHT/6);
  textAlign(CENTER, BOTTOM);
  push();
  textFont('Righteous');
  text('Snake', WIDTH/2, HEIGHT/2);
  pop();
  for(let i=0; i<menuButtons.length; i++){
    menuButtons[i].display();
  }
  pop();
}

function drawLossMenu(){
  push();
  fill(255);
  textSize(HEIGHT/6);
  textAlign(CENTER, BOTTOM);
  text('Game Over', WIDTH/2, HEIGHT/2 - HEIGHT/11);
  for(let i=0; i<lossButtons.length; i++){
    lossButtons[i].display();
  }
  fill(0, 255, 0);
  if(snakeSquares.length % 100 === snakeSquares.length){
    rect(HEIGHT/2 - HEIGHT/12, HEIGHT/2 - HEIGHT/12, HEIGHT/6, HEIGHT/6);
  }
  else{
    rect(HEIGHT/2 - HEIGHT/8, HEIGHT/2 - HEIGHT/12, HEIGHT/4, HEIGHT/6);
  }

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(HEIGHT/10);
  text(snakeSquares.length, HEIGHT/2, HEIGHT/2);
  pop();
}

function resetGame(){
  snakeSquares = [[5,15], [6,15], [7,15], [8,15], [9,15]];
  Dot.newDotSquare();
  currentDirection = "right";
  currentScene = "game";
}

class Dot{
  constructor(){
    
  }
  static newDotSquare(){
    let noSnake = false;
    let tempX;
    let tempY;
    while(noSnake === false){
      tempX = floor(random(0,30));
      tempY = floor(random(0,30));
      for(let i=0; i<=snakeSquares.length; i++){
        if(i === snakeSquares.length)
          noSnake = true;
        else if(snakeSquares[i][0] === tempX & snakeSquares[i][1] === tempY)
          i+=1000;
      }  
    }
    dotSquare = [tempX, tempY];
  }
  static displayDot(){
    push();
    fill(255);
    square(dotSquare[0]*squareWidth, dotSquare[1]*squareWidth, squareWidth);
    pop();
  }
}

class Button{
  constructor(x, y, width, height, color1, color2, text, action){
    this.isPressed = false;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.endX = x + width;
    this.endY = y + height;
    this.color1 = color1;
    this.color2 = color2;
    this.currentColor = color1;
    this.text = text;
    this.action = action;
  }
  display(){
    push();
    fill(this.currentColor);
    rect(this.x, this.y, this.width, this.height);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(HEIGHT/10);
    text(this.text, (this.x + this.endX)/2, (this.y + this.endY)/2);
    pop();
  }
  mousePressed(x, y){
    if(x >= this.x && x <= this.endX && y >= this.y && y <= this.endY){
      this.isPressed = true;
      this.currentColor = this.color2;
    }
  }
  mouseReleased(x, y){
    if(this.isPressed){
      this.action();
    }
    this.currentColor = this.color1;
    this.isPressed = false;
  }
}

function mousePressed(){
  switch(currentScene){
    case "loss":
      for(let i=0; i<lossButtons.length; i++){
        lossButtons[i].mousePressed(mouseX, mouseY);
      }
      break;
    case "menu":
      for(let i=0; i<menuButtons.length; i++){
        menuButtons[i].mousePressed(mouseX, mouseY);
      }
      break;
  }
}

function mouseReleased(){
  switch(currentScene){
    case "loss":
      for(let i=0; i<lossButtons.length; i++){
        lossButtons[i].mouseReleased(mouseX, mouseY);
      }
      break;
    case "menu":
      for(let i=0; i<menuButtons.length; i++){
        menuButtons[i].mouseReleased(mouseX, mouseY);
      }
      break;
  }
}
