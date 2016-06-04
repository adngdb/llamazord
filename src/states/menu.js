define(function () {
    "use strict";

    var Menu = function (game) {
    };

    Menu.prototype = {
        preload: function () {
            this.game.load.image('play_btn', 'assets/ui/play_btn.png');
        },

        create: function () {
            // Background.
            // Title.
            // Buttons.
            this.game.make.button(
                this.game.world.centerX,
                this.game.world.centerY,
                'play_btn',
                this.onPlay,
                this,
                2, 1, 0
            );
        },

        onPlay: function () {
            console.log('start game');
            this.game.state.start('Game');
        },
    };

    return Menu;
});
