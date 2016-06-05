define([
    'states/game',
],

    function (Game) {
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

            this.game.sound.stopAll();
            this.game.sound.play('ambiance_2', 0.5, true);

            var btn_credit = this.game.add.button(
                this.game.world.centerX,
                800 - 200,
                'credit_btn',
                this.onCredit,
                this,
                2, 1, 0
            );
            btn_credit.anchor.set(0.5, 0.5);
        },

        onPlay: function () {
            console.log('start game');
            this.game.state.add('Game', Game);
            this.game.state.start('Game');
        },
        onCredit: function () {
            console.log('Credit clicked');
            this.game.state.start('Credit');
        },
    };

    return Menu;
});
