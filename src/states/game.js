define([
    'constants',
    'classes/Player',
],
function (constants, Player) {
    var Game = function (game) {
        // grid format : [GRID_WIDTH][GRID_HEIGHT]
        this.grid = [];

        this.currentplayer = 0;
        this.players = [];
    };

    Game.prototype = {
        init: function () {
        },

        update: function () {
       },

        preload: function() {

            this.game.load.image('background', 'assets/back_green.png');
            this.game.load.image('grid', 'assets/grid.png');
            this.game.load.image('player', 'assets/player_blue.png');
            this.game.load.image('coin', 'assets/coin.png');

            // manage inputs
            this.computeInput();

            for(var i=0; i<constants.game.GRID_WIDTH; ++i) {
                this.grid[i] = [];
                for(var j=0; j<constants.game.GRID_HEIGHT; ++j) {
                    this.grid[i][j] = constants.coin.NO_COIN;
                }
            }
        },

		onClick : function(){
			console.log("prout");	
		},
        create: function () {
            // set background sprite
            var background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background');
            background.anchor.set(0.5, 0.5);

            // set grid sprite
			
            this.gridSprite = this.game.add.sprite(
                this.game.world.centerX,
                constants.stage.HEIGHT - (constants.stage.CELL_SIZE * (constants.game.GRID_HEIGHT + 1) / 2),
                'grid'
            );
			this.gridSprite.inputEnabled = true;
            this.gridSprite.anchor.set(0.5, 0.5);
			this.gridSprite.events.onInputUp.add(this.onClick,this);

            // set player sprite
            var player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
            player.anchor.set(0.5, 0.5);
            // create GUI
            this.createGUI();
            this.createGrid();

            // create players
            this.players[0] = new Player();

            var test = constants.game.GRID_WIDTH;

            this.click(240);
            this.click(240);
            this.click(240);
            this.click(240);
            this.click(240);
            this.click(60);
            this.click(420);
            this.click(600);
        },

        click: function(xClickPos) {
            var column = this.getColumn(xClickPos);
            var line = this.getLine(column);
            if (line == -1) {
                // No space in column
                this.invalidColumn();
            } else {
                // create coin
                this.grid[column][line] = 1;
                // TODO: set the "right" coin type
                this.createCoin(column, constants.stage.HEIGHT - (constants.game.GRID_HEIGHT - line + 1) * constants.stage.CELL_SIZE);
            }
        },

        createGUI: function () {
        },

        // Used for debugging. Might be deleted later?
        createGrid: function () {
            var offsetX = 90 / 2;
            var offsetY = 90 / 2 + (1280 - 90 * 6);

            for (var i = 0; i < constants.game.GRID_WIDTH; i++) {
                for (var j = 0; j < constants.game.GRID_HEIGHT; j++) {
                    var rect = new Phaser.Rectangle(offsetX + i * 90, offsetY + j * 90, 90, 90);
                    this.game.debug.geom(rect, 'rgba(200,0,0,0.5)');
                }
            }
        },

        computeInput: function() {

            // manage grid (if inputs)
            this.computeGrid();

            // switch player (if inputs)
            this.currentplayer = 1 - this.currentplayer;
        },

        computeGrid:function(){
            // search for "matchs"
        },

        createCoin: function(column, ydestination) {

            var coinYStart = constants.stage.COIN_START_HEIGHT + constants.stage.CELL_SIZE/2;
            var coinXStart = (column + 1) * constants.stage.CELL_SIZE;

            var coin = this.game.add.sprite(coinXStart, coinYStart, 'coin');
            coin.anchor.set(0.5, 0.5);
            var coinTween = this.game.add.tween(coin);

            coinTween.to({ y: ydestination }, (ydestination - coinYStart) * 2 );
            coinTween.start();
        },

        invalidColumn: function() {
                console.log("TODO : No place in column");
        },

        getColumn: function(xClickPos) {
            return Math.floor( (xClickPos - 45) / constants.stage.CELL_SIZE);
        },
		fire: function(){
			console.log("bonjour");
		var a= this.input.activePointer.x;
		console.log('X:' + this.input.activePointer.x);
			this.click(a);
		},


        getLine: function (column) {
            var bottom = constants.game.GRID_HEIGHT;
            while (this.grid[column][bottom] != constants.coin.NO_COIN) {
                --bottom;
            }

            return bottom;
        }

    };

    return Game;
});
