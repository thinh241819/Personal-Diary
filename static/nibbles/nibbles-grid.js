var Snake = Snake || {};

Snake.loadGrid = function(level) {
	// set up grid (800x600 resolution gives us a 20x15 grid of images 40x40 pixels
	Snake.gridWidth = 20;
	Snake.gridHeight = 15;

	Snake.gridElementWidth = Snake.canvasElement.width / Snake.gridWidth;
	Snake.gridElementHeight = Snake.canvasElement.height / Snake.gridHeight;

	for(var y = 0; y < Snake.gridHeight; y++) {
		for(var x = 0; x < Snake.gridWidth; x++) {
			var gridItem = parseInt(Snake.levels[level][y * Snake.gridWidth + x], 10);
			Snake.grid.push(new Snake.gridItem(x,y, gridItem));
		}
	}

	// initialize the snake
	Snake.snake.push(new Snake.gridItem(Math.floor(Snake.gridWidth / 2),
										Math.floor(Snake.gridHeight / 2),
										Snake.gridTypes.SNAKE));
}

Snake.drawGrid = function() {
	for(var i = 0; i < Snake.grid.length; i++) {
		Snake.grid[i].draw(Snake.context);
	}

	// draw snakes
	for(var s = 0; s < Snake.snake.length; s++) {
		Snake.snake[s].draw(Snake.context);
		Snake.setPositionRedraw(Snake.snake[s].x, Snake.snake[s].y);
	}

	// draw food
	Snake.food.draw(Snake.context);
}

Snake.drawScore = function() {
	// white text
	Snake.context.fillStyle = 'rgb(255,255,255)';
	Snake.context.font = "30px Verdana";
	Snake.context.fillText(Snake.score.toString(), 62, 90);
	Snake.setPositionRedraw(1,1);
	Snake.setPositionRedraw(2,1);
}

Snake.drawGameOver = function() {
	Snake.context.fillStyle = 'rgb(255,0,0)';
	Snake.context.globalAlpha =0.80;
	Snake.context.fillRect(0,0,Snake.canvasElement.width, Snake.canvasElement.height);
	Snake.context.fillStyle = 'rgb(255,255,255)';
	Snake.context.font = "50px Arial";
	Snake.context.fillText('Game Over!', Snake.canvasElement.width/2 - 100, Snake.canvasElement.height/2 - 20);
}

Snake.setPositionRedraw = function(x,y)
{
	var index = y * Snake.gridWidth + x;
	Snake.grid[index].redraw = true;
}

Snake.setPositionType = function(x,y,type) {
	var index = y * Snake.gridWidth + x;
	Snake.grid[index].type = type;
	Snake.grid[index].redraw = true;
}

Snake.getPositionType = function(x,y) {
	var index = y * Snake.gridWidth + x;
	return Snake.grid[index].type;
}

Snake.createFood = function() {
	var currentType = Snake.gridTypes.WALL;
	var x = -1;
	var y = -1;

	while(currentType == Snake.gridTypes.WALL)
	{
		for(var i = 1; i < Snake.snake.length; i++)
		{
			if(x == Snake.snake[i].x && y == Snake.snake[i].y)
					{ continue;}
		}
		x = Math.floor(Math.random() * Snake.gridWidth);
		y = Math.floor(Math.random() * Snake.gridHeight);

		currentType = Snake.getPositionType(x, y);
	}

	Snake.food = new Snake.gridItem(x,y, Snake.gridTypes.FOOD);
}

Snake.gridItem = function (x, y, type) {
	var self = this;

	this.redraw = true;
	this.x = x;
	this.y = y;
	this.type = type;

	this.draw = function(context) {
		if(self.redraw) {
			var img = Snake.imageFiles[self.type][1];
			context.drawImage(img, 0, 0, img.width, img.height, self.x * Snake.gridElementWidth, self.y * Snake.gridElementHeight, Snake.gridElementWidth, Snake.gridElementHeight);
			self.redraw = false;
		}
	}
}