String.prototype.oppositeDirection = function(){
	if(this=='r'){ return 'l'; }
	if(this=='l'){ return 'r'; }
	if(this=='u'){ return 'd'; }
	if(this=='d'){ return 'u'; }
}
var snake={
	position: [25,20],
	direction: "r",
	body: [[20, 20],[21,20],[22,20],[23,20],[24,20],[25,20]],
	cannotGoTo: "l",
	food: 0,
	
	init: function(){
		for (i in this.body){
			console.log(x + "," + y);
			var x = this.body[i][0];
			var y = this.body[i][1];
			gameBoard.findBlock([x,y]).addClass('snake');
		}
	},
	newSnake: function(){
		this.position = [25,20];
		this.direction = "r";
		this.body = [[20, 20],[21,20],[22,20],[23,20],[24,20],[25,20]];
		this.cannotGoTo = "l";
		this.food = 0;
	},
	move: function(){
		this.moveHead();
		this.moveBody();
		this.tryToEat();
		this.cannotGoTo=this.direction.oppositeDirection();
	},
	moveHead: function(){
		if(this.direction=="r") { this.position[0]+=1;}
		if(this.direction=="l") { this.position[0]-=1;}
		if(this.direction=="d") { this.position[1]+=1;}
		if(this.direction=="u") { this.position[1]-=1;}
	},
	moveBody: function(){
		if(this.food==0){
			gameBoard.findBlock(this.body[0]).removeClass('snake');
			this.body.shift();
		} else{
			this.food--;
		}
		if(this.isDead()){return false;}

		var temp=[this.position[0],this.position[1]];
		this.body.push(temp);
		gameBoard.findBlock(this.position).addClass('snake');
	},
	isDead: function(){
		if(gameBoard.isPopulated(this.position)){
			console.log("Ate yourself!");
			game.pause();
			return true;
		}
		if(this.position[0]>gameBoard.width-1 || this.position[1]>gameBoard.height-1 || this.position[0]<0 || this.position[1]<0){
			console.log("Out of the area!");
			game.pause();
			return true;
		}
		return false;
	},
	eat: function(food){
		this.food+= food;
	},
	tryToEat: function(){
		if(this.position[0]==food.place[0] && this.position[1]==food.place[1]){
		//if(this.position==food.place){ TOCHECK {why cannot use this?}
			this.eat(1);
			food.eaten();
		}
	},
};
var k;//TOFIX
var game = {
	isPlaying: false,
	score: 0,
	newGame: function(){
		gameBoard.$board.find('.square').removeClass('snake').removeClass('food');
		if(this.isPlaying){
			this.pause();
		}
		this.score=0;
		this.play();
		snake.newSnake();
		snake.init();
		food.init();
	},
	play: function(){
		console.log('started');
		this.isPlaying=true;
		k= setInterval(function(){
    		snake.move();
    		game.score++;
    		$('#score').text(game.score);
    	}, 100)
	},
	pause: function(){
		this.isPlaying=false;
		clearInterval(k);
	},
}

var food = {
	place: [0,0],
	init: function(){
		do{
			this.place[0] = Math.floor(Math.random()*40);
			this.place[1] = Math.floor(Math.random()*40);
		} while(gameBoard.isPopulated(this.place))

		gameBoard.findBlock(this.place).addClass("food");
		console.log('food in ' + this.place);
	},
	eaten: function(){
		gameBoard.findBlock(this.place).removeClass("food");
		game.score+=10;
		this.init();
	}
}

var gameBoard={
	width: 40,
	height: 40,
	$board: $("#gameBoard"),

	init: function(){
		for(var y=0;y<this.height;y++){
			var $row = this.mkDiv()
			.addClass('rw-' + y)
			.appendTo(this.$board);
	
			for(var x=0;x<this.width;x++){
				this.mkDiv()
				.addClass('square').addClass('sq-' + x)
				.appendTo($row);
			}
		}
	},

	mkDiv: function(){
		return $('<div></div>');
	},
	findBlock: function(pos){
		return $('.rw-' + pos[1] + '>.sq-' + pos[0]);
	},
	isPopulated: function(pos){
		return this.findBlock(pos).hasClass('snake');
	}
};

$(document).on('keydown', function(e){
	switch(e.which){
		case 37: if(snake.cannotGoTo!="l"){
			snake.direction='l';console.log('l');}
		break;
		case 38: if(snake.cannotGoTo!="u"){
			snake.direction='u';console.log('u');}
		break;
		case 39: if(snake.cannotGoTo!="r"){
			snake.direction='r';console.log('r');}
		break;
		case 40: if(snake.cannotGoTo!="d"){
			snake.direction='d';console.log('d');}
		break;
		case 80: if(game.isPlaying){
			gameController.$pause.trigger('click');
			}
		break;
		default: return this;
	};
	e.preventDefault();
});

var gameController = {
	$pause: $('#pauseOrResume'),
	init: function(){
		$('#newGame').on('click', function(){
			game.newGame();
			gameController.$pause.fadeIn(300).text("Pause")
			.addClass('btn-warning').removeClass('btn-info');
		});
		gameController.$pause.on('click', function(){
			if(game.isPlaying){
		 		game.pause();
		 		gameController.$pause.text("Resume")
		 		.addClass('btn-info').removeClass('btn-warning');
		 	} else {
		 		game.play();
		 		gameController.$pause.text("Pause")
		 		.addClass('btn-warning').removeClass('btn-info');
		 	}
		});
	}
}
$(document).ready(function(){
	gameBoard.init();
	snake.init();
	gameController.init();
});

