define(function () {

    var Preloader = function(game) {
        this.background = null;
        this.preloadBar = null;
        this.loadingText = null;
    };

    Preloader.prototype = {

        init: function () {
        },

        preload: function() {
            this.background = this.add.sprite(this.world.centerX - 162, this.world.centerY + 100, 'preloaderBackground');
            this.preloadBar = this.add.sprite(this.world.centerX - 162, this.world.centerY + 100, 'preloaderBar');
            this.loadingText = this.add.sprite(this.world.centerX - 162, this.world.centerY - 10, 'preloaderText');

            this.load.setPreloadSprite(this.preloadBar);

            // UI elements.
            this.game.load.image('play_btn', 'assets/ui/play_btn.png');

            // Game state stuff
            this.game.load.image('background', 'assets/back_green.png');
            this.game.load.image('grid', 'assets/grid.png');
            this.game.load.image('grid-front', 'assets/grid-front.png');
            this.game.load.image('arena', 'assets/arena.png');

            // Llama assets.
            this.game.load.spritesheet('llama-raw-idle', 'assets/llama/llama-raw-idle.png', 470, 470, 25);
            this.game.load.spritesheet('llama-raw-hit', 'assets/llama/llama-raw-hit.png', 470, 470, 18);
            this.game.load.spritesheet('llama-raw-victory', 'assets/llama/llama-raw-victory.png', 470, 470, 34);
            this.game.load.spritesheet('llama-raw-death', 'assets/llama/llama-raw-death.png', 470, 470, 21);

            // coin assets
            this.game.load.image('coin_sun', 'assets/jeton-soleil.png');
            this.game.load.image('coin_bird', 'assets/jeton-oiseau.png');
            this.game.load.image('coin_lizard', 'assets/jeton-lezard.png');
            this.game.load.image('coin_selected', 'assets/jeton-clic.png');
            this.game.load.image('coin_over', 'assets/jeton-survol.png');
            // Upgrade assets

            this.game.load.image('choice_Upgrade', 'assets/choice.png');
            this.game.load.image('attack', 'assets/player_red.png');
            this.game.load.image('defense', 'assets/player_green.png');

            this.game.load.image('craft', 'assets/craft.png');
            // load audio
            this.game.load.audio('ambiance', 'assets/sfx/ambience.ogg');
            this.game.load.audio('ambiance_2', 'assets/sfx/ambience_2.ogg');
            this.game.load.audio('hit', 'assets/sfx/hit.ogg');
            this.game.load.audio('sliding', 'assets/sfx/sliding.ogg');
        },

        create: function() {
            // Animate away.
            this.add.tween(this.background)
                .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
            this.add.tween(this.loadingText)
                .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
            this.add.tween(this.preloadBar)
                .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true)
                .onComplete.add(this.startGame, this);
        },

        startGame: function() {
             this.game.state.start('Menu');
        }

    };

    return Preloader;
});
