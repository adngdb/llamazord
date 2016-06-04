define(function () {
    "use strict";

    var Menu = function (game) {
    };

    Menu.prototype = {
        create: function () {
            // Background.
            // Title.
            // Buttons.
            var btn = this.game.add.button(
                this.game.world.centerX,
                this.game.world.centerY - 200,
                'play_btn',
                this.onPlay,
                this,
                2, 1, 0
            );
            btn.anchor.set(0.5, 0.5);
        },

        onPlay: function () {
            console.log('start game');
            this.game.state.start('Game');
        },
    };

    return Menu;
});
