define(function () {
    var Game = function (game) {
    };

    Game.prototype = {

        init: function () {
        },

        update: function () {
        },

        preload: function() {
            this.game.load.image('background', 'assets/back_green.png');
            this.game.load.image('player', 'assets/player_blue.png');

        },

        create: function () {

            var background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background');
            background.anchor.set(0.5, 0.5);

            var player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
            player.anchor.set(0.5, 0.5);

        },

        createGUI: function () {
        }

    };

    return Game;
});
