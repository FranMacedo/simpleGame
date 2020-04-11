var canvas;
var canvasContext;
var screenWidth;	
var screenHeight;
var ballX = 50;
var ballY = 50;

speedDiff = {
	'easy': {x:15, y:8, c:6},
	'medium': {x:20, y:12, c:10},
	'hard': {x:25, y:16, c:14}
}


//{x:15, y:8, c:6}
//speedMedium = {x:20, y:12, c:10}
//speedHard = {x:25, y:16, c:14}

var ballSpeedX = speedDiff.easy.x;
var ballSpeedY = speedDiff.easy.y;
var computerSpeed = speedDiff.easy.c;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 20;
const BALL_RADIUS = 10;
const PADDLE_MARGIN = 10;

function calculateMousePos (evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left -root.scrollLeft;
	var mouseY = evt.clientY - rect.top -root.scrollTop;

	return {
			x: mouseX,
			y: mouseY
	}
}

function handleMouseClick (evt){
	if (showWinScreen){
			player1Score = 0;
			player2Score = 0;
			showWinScreen = false;
	}

}

function changeDifficulty (){
	$("#btnGroup").children().click(function(){
		$("#btnGroup").children().each(function(){
			$(this).removeClass('active');
		})

		$(this).toggleClass('active');
		var diff = $(this).attr('id').split('_')[0];

		if (ballSpeedX<0){
			ballSpeedX = -speedDiff[diff].x;
		}
		else{
			ballSpeedX = speedDiff[diff].x;
		}
		computerSpeed = speedDiff[diff].c;
	})	
}

window.onload = function(){

	canvas = document.getElementById('gameCanvas');
	var dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
	canvas.width = dimension[0]*0.98;
	canvas.height = dimension[1]*0.91;

	canvasContext = canvas.getContext('2d');
	canvasContext.font = "30px Arial";
	screenWidth = canvas.width;
	screenHeight = canvas.height;
	var framesPerSecond = 30;
	setInterval(function(){
		moveEverything();		
		drawEverything ();

	}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick)

	canvas.addEventListener('mousemove',
		function(evt) {
				var mousePos = calculateMousePos(evt);
				paddle1Y = mousePos.y - PADDLE_HEIGHT/2;

		}
	);

	changeDifficulty();


}

function ballReset() {

	if (player1Score >= WINNING_SCORE ||
		player2Score >= WINNING_SCORE){

			showWinScreen = true;
	}

		
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;

}

function computerMovement(){
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	var movementBuffer = (PADDLE_HEIGHT/2)*0.7
	if (paddle2YCenter < ballY - movementBuffer){
		paddle2Y += computerSpeed;
	}
	else if (paddle2YCenter > ballY + movementBuffer){
		paddle2Y -= computerSpeed;

	}

}

function moveEverything() {
	if (showWinScreen){
			return;
	}
	computerMovement();
	
	ballX += ballSpeedX;
	ballY += ballSpeedY;		

	// position for player2 and score for player 1
	if (ballX + BALL_RADIUS/2> screenWidth-PADDLE_THICKNESS-PADDLE_MARGIN){
		if (ballY > paddle2Y &&
		    ballY < paddle2Y + PADDLE_HEIGHT){
			
			ballSpeedX = -ballSpeedX;
			
			var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY *0.35;
		}
		else{
			if(ballX + BALL_RADIUS/2> screenWidth){

				player1Score++; // must be BEFORE ballReset
				ballReset();
			}
			
		}
	}

	// position for player 1 and score for player 2
	if (ballX - BALL_RADIUS/2< 0 + PADDLE_THICKNESS +PADDLE_MARGIN){
		if (ballY > paddle1Y &&
			ballY < paddle1Y + PADDLE_HEIGHT){
				ballSpeedX = -ballSpeedX;	
				var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);

				ballSpeedY = deltaY *0.35;

		}
		else{
			if(ballX - BALL_RADIUS/2 < 0){

				player2Score++;
				ballReset();
			}
		}
	}
	if (ballY > screenHeight){
		ballSpeedY = -ballSpeedY;
	}
	if (ballY < 0){
		ballSpeedY = -ballSpeedY;
	}
	
}

function drawNet(){

	for (var i=0; i<screenHeight; i+=40){
		colorRect(screenWidth/2-1, i, 2, 20, 'white')
	}

}
function drawEverything() {

	// blanks out screen with black
	colorRect(0,0, screenWidth, screenHeight, 'black');

	canvasContext.fillStyle = 'white';		
	if (showWinScreen){
		if (player1Score >= WINNING_SCORE){
					var winTxt = "Player 1 wins!"
				}
		else{
			var winTxt = "Player 2 wins!"
		}
		var continuTxt = "click to continue";

		txtWidth1 = canvasContext.measureText(winTxt).width;
		txtWidth2 = canvasContext.measureText(continuTxt).width;
		txtWidth = Math.max(txtWidth1, txtWidth2);
		
		canvasContext.fillText(winTxt, screenWidth/2 - txtWidth/2, screenHeight*0.2);				
		canvasContext.fillText(continuTxt, screenWidth/2 - txtWidth/2, screenHeight*0.8);

		return;
	}

	drawNet();
	// creates left side paddle
	colorRect(PADDLE_MARGIN,paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');


	// creates right side paddle
	colorRect(screenWidth-PADDLE_THICKNESS-PADDLE_MARGIN, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');


	// creates ball
	colorCircle(ballX, ballY, BALL_RADIUS, 'white');

	canvasContext.fillText(player1Score, screenWidth/2/2, screenHeight*0.1);
	canvasContext.fillText(player2Score, screenWidth/2 + screenWidth/2/2, screenHeight*0.1);


}

function colorCircle(centerX, centerY, radius, drawColor){

	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();

}
function colorRect(leftX, topY, width, height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width, height);

}