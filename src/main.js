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
    'states/game',
    'constants',
    'classes/Player',
],
function (Boot, Preloader, Menu, Game, constants, Player) {
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
        this.game.state.add('Boot', Boot);
        this.game.state.add('Preloader', Preloader);
        this.game.state.add('Menu', Menu);
        this.game.state.add('Game', Game);

        this.game.state.start('Boot');
    }
});
