const snakeCanvas = document.getElementById("snakeCanvas");
var ctx = snakeCanvas.getContext("2d");


// размер канваса можно менять
const canvasHeight = 500;
const canvasWidth = 500;
snakeCanvas.height = canvasHeight;
snakeCanvas.width = canvasWidth;

// значения "клетки" можно менять на 10,20,25,50
const cellHeight = 20;
const cellWidth = 20;

// для блокировки смены за 1 тик направления 2 раза
var pressChange = true;

var snake = {
	"move": "up",
	"cells": [[6,6],[6,7],[6,8],[6,9]]
}
var apple = [];

var interval;

function start () {
	addApple();
	interval = setInterval(draw,100);

}
start();

function draw () {
	clearFillBlack();
	keepAppleOnField();
	moveSnake();
	pressChange = true;
	checkIfAteApple();
	updateSnakePos();
	collisionCheck();
}

function clearFillBlack () {
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
}

function gameOver () {
	clearInterval(interval);
	alert("Game Over");
}

// проверяю наткнулась ли змея на саму себя
function collisionCheck () {
	let snakeHead = snake.cells[0];
	let headChecked = false;
	snake.cells.forEach(cell => {
		if(!headChecked){
			headChecked = true;
			return
		}
		if(snakeHead[0] === cell[0] && snakeHead[1]=== cell[1]) {
			gameOver()
			return
		}
	})
}

// змея наткнулась на яблоко
function checkIfAteApple () {
	if (snake.cells[0][0]===apple[0]&&snake.cells[0][1]===apple[1]) {
		snakeGrow();
		addApple();
	}
}
// добавляем 1 клетоточку змее сзади
function snakeGrow(){
	let xChange = 0;
	let yChange = 0;
	let length = snake.cells.length;
	let arrToPush = snake.cells[length-1];

	snake.cells[length - 2][0] > snake.cells[length - 1][0] ? xChange = 1 : snake.cells[length - 2][0] < snake.cells[length - 1][0] ? xChange = -1 : xChange = 0;
	snake.cells[length - 2][1] > snake.cells[length - 1][1] ? yChange = 1 : snake.cells[length - 2][1] < snake.cells[length - 1][1] ? yChange = -1 : yChange = 0;
	arrToPush[0] += xChange;
	arrToPush[1] += yChange;
	snake.cells.push(arrToPush);
}


// яблоко-----------------------------------------------

function keepAppleOnField (){
	ctx.fillStyle = "red";
	ctx.fillRect(apple[0]*cellWidth,apple[1]*cellHeight,cellWidth,cellHeight);
}

function addApple(){
	let appleCoord = randomApple();
	ctx.fillStyle = "red";
	ctx.fillRect(apple[0]*cellWidth,apple[1]*cellHeight,cellWidth,cellHeight);
	apple = appleCoord;
}

function randomApple() {
	let coords = randomCoords();
	let sameCoords = false;
	snake.cells.forEach(cell => {
		if (coords[0] === cell[0] && coords[1] === cell[1]) {
			sameCoords = true;
		}	
	});
	if(sameCoords){
		return randomApple();
	}
	return coords;
}

function randomCoords() {
	let x = Math.floor(Math.random() * (canvasWidth / cellWidth));
	let y = Math.floor(Math.random() * (canvasHeight / cellHeight));
	return [x,y];
}




// рисую змею на поле
function updateSnakePos () {
	snake.cells.forEach(arr => {
		let x = arr[0]*cellWidth;
		let y = arr[1]*cellHeight;
		ctx.fillStyle = "green";
		ctx.fillRect(x,y,cellWidth,cellHeight);
	})
};

//меняет значение внутри snake.cells
function moveSnake () {
	let moveTo = snake.move;
	let snakeArrCopy = JSON.parse(JSON.stringify(snake.cells));

	if(moveTo === "up") {
		snake.cells[0][1]--;
	}else if (moveTo === "down"){
		snake.cells[0][1]++;
	}else if (moveTo === "left"){
		snake.cells[0][0]--;
	}else if (moveTo === "right"){
		snake.cells[0][0]++;
	}
	for(let i = 1;i < snakeArrCopy.length;i++){
		snake.cells[i] = snakeArrCopy[i-1];
	}
	checkIfBorders();

}
function checkIfBorders(){
	snake.cells.forEach(cell =>{
		if(cell[0] < 0) {
			cell[0] = (canvasWidth / cellWidth) - 1;
		}
		else if(cell[0] > (canvasWidth / cellWidth) - 1) {
			cell[0] = 0;
		}
		else if(cell[1] < 0) {
			cell[1] = (canvasHeight / cellHeight) - 1;
		}
		else if(cell[1] > (canvasWidth / cellWidth) - 1) {
			cell[1] = 0;
		}
	})
}


// меняю направление движения змеи
function changeDirection (changeTo) {
	if(snake.move === "up" && changeTo === "down") {
		return
	}
	if(snake.move === "down" && changeTo === "up") {
		return
	}
	if(snake.move === "left" && changeTo === "right") {
		return
	}
	if(snake.move === "right" && changeTo === "left") {
		return
	}
	if(snake.move === changeTo) {
		return
	}
	pressChange = false;
	snake.move = changeTo;
}

document.addEventListener("keydown",function(event){
	if(!pressChange) {
		return
	}
	if(event.keyCode === 87) {
		changeDirection("up");
	}
	if(event.keyCode === 68) {
		changeDirection("right");
	}
	if(event.keyCode === 83) {
		changeDirection("down");
	}
	if(event.keyCode === 65) {
		changeDirection("left");
	}
});