define([
    'utils',
    'states/game',
],
function (utils, Game) {
    "use strict";

    var Menu = function (game) {};

    Menu.prototype = {
        create: function () {
            // Background.
            this.bg = this.game.add.sprite(
                this.game.world.centerX,
                this.game.world.centerY,
                'background'
            );
            this.bg.anchor.set(0.5, 0.5);

            // Title.
            this.logo = this.game.add.sprite(
                this.game.world.centerX,
                100,
                'logo'
            );
            this.logo.anchor.set(0.5, 0.5);

            // Buttons.
            var btn = this.game.add.button(
                this.game.world.centerX,
                this.game.world.centerY - 350,
                'play_btn',
                this.onPlay,
                this,
                2, 1, 0
            );
            btn.anchor.set(0.5, 0.5);

            var btn_credit = this.game.add.button(
                this.game.world.centerX + 150,
                this.game.world.centerY - 200,
                'credit_btn',
                this.onCredit,
                this,
                2, 1, 0
            );
            btn_credit.anchor.set(0.5, 0.5);

            var btn_fullScreen = this.game.add.button(
                this.game.world.centerX - 150,
                this.game.world.centerY - 200,
                'btn_fullscreen',
                this.onFullScreen,
                this,
                2, 1, 0
            );
            btn_fullScreen.anchor.set(0.5, 0.5);

            // Create sound muting buttons.
            utils.createSoundBtns(this.game);

            this.game.sound.stopAll();
            this.game.sound.play('ambiance_2', 0.5, true);
        },

        onPlay: function () {
            this.game.state.add('Game', Game);
            this.game.state.start('Game');
        },

        onCredit: function () {
            this.game.state.start('Credit');
        },

        onFullScreen: function () {
            if (this.game.scale.isFullScreen) {
                this.game.scale.stopFullScreen();
            }
            else {
                this.game.scale.startFullScreen(false);
            }
        },
    };

    return Menu;
});
