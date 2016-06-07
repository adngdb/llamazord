requirejs.config({
    baseUrl: 'src/',

    paths: {
        'lib': '../lib'
    }
});

require([
    'states/boot',
    'states/preloader',
    'states/menu',
    'states/credit',
    'constants',
    'classes/Player',
],
function (Boot, Preloader, Menu, Credit, constants, Player) {
    'use strict';

    var game = new Phaser.Game(
        constants.stage.WIDTH,
        constants.stage.HEIGHT,
        Phaser.AUTO,
        'stage',
        {
            create: create,
        }
    );

    function create() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.game.state.add('Boot', Boot);
        this.game.state.add('Preloader', Preloader);
        this.game.state.add('Menu', Menu);
        this.game.state.add('Credit', Credit);
        this.game.state.start('Boot');
    }
});
