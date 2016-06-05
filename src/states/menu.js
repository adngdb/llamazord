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
            //background
            this.bg=this.game.add.sprite(350,600,'background');
            this.bg.anchor.set(0.5, 0.5);

            var btn = this.game.add.button(
                this.game.world.centerX,
                500 - 200,
                'play_btn',
                this.onPlay,
                this,
                2, 1, 0
            );
            btn.anchor.set(0.5, 0.5);

            this.game.sound.stopAll();
            this.game.sound.play('ambiance_2', 0.5, true);

            //logo
            this.logo=this.game.add.sprite(320,100,'logo');
            this.logo.anchor.set(0.5, 0.5);

            var btn_credit = this.game.add.button(
                500,
                630 - 200,
                'credit_btn',
                this.onCredit,
                this,
                2, 1, 0
            );
            btn_credit.anchor.set(0.5, 0.5);

            var btn_fullScreen = this.game.add.button(
                200,
                630 - 200,
                'btn_fullscreen',
                this.onFullScreen,
                this,
                2, 1, 0
            );
            btn_fullScreen.anchor.set(0.5, 0.5);
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
        onFullScreen: function () {
            console.log('FullScreen clicked');
            //this.game.state.start('Credit');
        },
    };

    return Menu;
});
