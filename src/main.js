console.log('coucou');

(function () {
    'use strict';

    requirejs.config({
        baseUrl: 'src/',

        paths: {
            'lib': '../lib'
        }
    });

    require([
    'states/game'
    ],

    function (Game) {
        var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'stage', {
            init: init,
            create: create
        });

        function init() {
            // Activate plugins.
        }

        function create() {
        /*    this.game.state.add('Boot', Boot);
            this.game.state.add('Preload', Preloader);
            this.game.state.add('Title', Title);*/
            this.game.state.add('Game', Game);

            this.game.state.start('Game');
        }
    });

}());
