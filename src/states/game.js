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
            this.game.load.image('player', 'assets/player_blue.png');
            this.game.load.image('coin', 'assets/coin.png');

            // manage inputs
            this.computeInput();
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

            var test = constants.GRID_WIDTH;

            this.createCoin();

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

        createCoin: function() {
            var coinStart = 740;
            var ydestination = 1280-45;

            var coin = this.game.add.sprite(135, coinStart, 'coin');
            coin.anchor.set(0.5, 0.5);
            var coinTween = this.game.add.tween(coin);

            coinTween.to({ y: ydestination }, (ydestination - coinStart ) );
            coinTween.start();
        },



    };

    return Game;
});
