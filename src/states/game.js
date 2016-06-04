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
			
			if (this.game.input.activePointer.isDown)
					{
						this.fire();
					}
        },

        preload: function() {

            this.game.load.image('background', 'assets/back_green.png');
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

        create: function () {
            // set background sprite
            var background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background');
            background.anchor.set(0.5, 0.5);
            // set player sprite
            var player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
            player.anchor.set(0.5, 0.5);
            // create GUI
            this.createGUI();

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
/** BLOCK to "treat" a click ***/
            var column = this.getColumn(xClickPos);
            var line = this.getLine(column);
            if (line == -1) {
                // No space in column
                this.invalidColumn();
            } else {
                // create coin
                this.grid[column][line] = 1;
    /** TODO : set the "right" coin type*/
                this.createCoin(column, constants.stage.HEIGHT - (constants.game.GRID_HEIGHT - line + 1) * constants.stage.CELL_SIZE);
            }
/*** END BLOCK to "treat" a click */
        },

        createGUI: function () {
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
		
		fire: function(){
			console.log("bonjour");
		}

        invalidColumn: function() {
                console.log("TODO : No place in column");
        },

        getColumn: function(xClickPos) {
            return Math.floor( (xClickPos - 45) / constants.stage.CELL_SIZE);
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
