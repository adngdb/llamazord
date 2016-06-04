define(
    ['constants',
   'classes/Player',

],
    function (constants, Player) {
    var Game = function (game) {
        //  grid format : [GRID_WIDTH][GRID_HEIGHT]
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



/** BLOCK to "treat" a click ***/
            var xClickPos;
            var ydestination = this.searchYdestination(xClickPos);
            if (ydestination == -1) {
                // No space in column
                this.invalidColumn();
            } else {
                // create coin
                this.grid[][]
                this.createCoin(1280 - 45 - (constants.game.GRID_HEIGHT - ydestination)* 90);
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

        createCoin: function(ydestination) {
            var coinStart = 740;

            var coin = this.game.add.sprite(135, coinStart, 'coin');
            coin.anchor.set(0.5, 0.5);
            var coinTween = this.game.add.tween(coin);

            coinTween.to({ y: ydestination }, (ydestination - coinStart ) );
            coinTween.start();
        },

        invalidColumn: function() {
                console.log("TODO : No place in column");
        },

        searchYdestination: function (xClickPos) {
            var bottom = constants.game.GRID_HEIGHT;
            // Todo : calc Column from xClickPos
            var column = 1;
            while (this.grid[column][bottom] != constants.coin.NO_COIN) {
                --bottom;
            }

            return bottom;
        }

    };

    return Game;
});
