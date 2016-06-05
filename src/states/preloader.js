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
            this.game.load.image('credit_btn', 'assets/ui/credit_btn.png');
            // Game state stuff
            this.game.load.image('player_background', 'assets/player_background.png');
            this.game.load.image('grid', 'assets/grid.png');
            this.game.load.image('grid-front', 'assets/grid-front.png');
            this.game.load.image('arena', 'assets/arena.png');

            // Llama assets.
            this.game.load.spritesheet('llama-raw-idle', 'assets/llama/llama-raw-idle.png', 470, 470, 25);
            this.game.load.spritesheet('llama-raw-hit', 'assets/llama/llama-raw-hit.png', 470, 470, 18);
            this.game.load.spritesheet('llama-raw-victory', 'assets/llama/llama-raw-victory.png', 470, 470, 34);
            this.game.load.spritesheet('llama-raw-death', 'assets/llama/llama-raw-death.png', 470, 470, 21);
                // Llama casque assets
            this.game.load.spritesheet('llama-sun-defense-idle', 'assets/llama/CASQUE/CASQUE_IDLE.png', 470, 470, 25);
            this.game.load.spritesheet('llama-sun-defense-hit', 'assets/llama/CASQUE/CASQUE_HIT.png', 470, 470, 18);
            this.game.load.spritesheet('llama-sun-defense-victory', 'assets/llama/CASQUE/CASQUE_VICTORY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-sun-defense-death', 'assets/llama/CASQUE/CASQUE_DEAD.png', 470, 470, 21);

            // coin assets
            this.game.load.spritesheet('coin_sun', 'assets/token_sun.png', 90, 90, 3);
            this.game.load.spritesheet('coin_bird', 'assets/token_bird.png', 90, 90, 3);
            this.game.load.spritesheet('coin_lizard', 'assets/token_lizard.png', 90, 90, 3);

            // Upgrade assets
            this.game.load.image('choice_Upgrade', 'assets/choice.png');
            this.game.load.image('attack', 'assets/player_red.png');
            this.game.load.image('defense', 'assets/player_green.png');

            this.game.load.image('craft', 'assets/player_selected.png');
            // end screen asset
            this.game.load.image('happy-end', 'assets/llama-happy-end.png');
            //Credit
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
