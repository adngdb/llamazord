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
            this.game.load.image('play_btn', 'assets/ui/btn_play.png');
            this.game.load.image('credit_btn', 'assets/ui/btn_credit.png');
            this.game.load.image('background', 'assets/ui/background.png');
            this.game.load.image('btn_fullscreen', 'assets/ui/btn_fullscreen.png');
            // Game state stuff
            this.game.load.image('player_background', 'assets/player_background.png');
            this.game.load.image('grid', 'assets/grid.png');
            this.game.load.image('grid-front', 'assets/grid-front.png');
            this.game.load.image('arena', 'assets/arena.png');

            // Llama assets.
            this.game.load.spritesheet('llama-raw-attack', 'assets/llama/llama-raw-attack.png', 470, 470, 33);
            this.game.load.spritesheet('llama-raw-spit', 'assets/llama/llama-raw-spit.png', 470, 470, 43);
            this.game.load.spritesheet('llama-raw-idle', 'assets/llama/LAMA_NUDE/LAMA_NUDE_IDLE.png', 470, 470, 25);
            this.game.load.spritesheet('llama-raw-hit', 'assets/llama/LAMA_NUDE/LAMA_NUDE_HIT.png', 470, 470, 18);
            this.game.load.spritesheet('llama-raw-victory', 'assets/llama/LAMA_NUDE/LAMA_NUDE_VICTORY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-raw-death', 'assets/llama/LAMA_NUDE/LAMA_NUDE_DEAD.png', 470, 470, 21);

            // Llama helmet assets
            this.game.load.spritesheet('llama-sun-defense-attack', 'assets/llama/CASQUE/CASQUE_ATTACK.png', 470, 470, 33);
            this.game.load.spritesheet('llama-sun-defense-idle', 'assets/llama/CASQUE/CASQUE_IDLE.png', 470, 470, 25);
            this.game.load.spritesheet('llama-sun-defense-hit', 'assets/llama/CASQUE/CASQUE_HIT.png', 470, 470, 18);
            this.game.load.spritesheet('llama-sun-defense-victory', 'assets/llama/CASQUE/CASQUE_VICTORY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-sun-defense-death', 'assets/llama/CASQUE/CASQUE_DEAD.png', 470, 470, 21);
            this.game.load.spritesheet('llama-sun-defense-spit', 'assets/llama/CASQUE/CASQUE_ATTACK.png', 470, 470, 33);

            // Llama canon assets
            this.game.load.spritesheet('llama-sun-attack-attack', 'assets/llama/SOLARCANON/SOLARCANON_ATTACK.png', 470, 470, 33);
            this.game.load.spritesheet('llama-sun-attack-idle', 'assets/llama/SOLARCANON/SOLARCANON_IDLE.png', 470, 470, 25);
            this.game.load.spritesheet('llama-sun-attack-hit', 'assets/llama/SOLARCANON/SOLARCANON_HIT.png', 470, 470, 18);
            this.game.load.spritesheet('llama-sun-attack-victory', 'assets/llama/SOLARCANON/SOLARCANON_VICTORY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-sun-attack-death', 'assets/llama/SOLARCANON/SOLARCANON_DEAD.png', 470, 470, 21);

            // Llama collar assets
            this.game.load.spritesheet('llama-lizard-defense-attack', 'assets/llama/COLLIER/COLLIER_ATTACK.png', 470, 470, 33);
            this.game.load.spritesheet('llama-lizard-defense-idle', 'assets/llama/COLLIER/COLLIER_IDLE.png', 470, 470, 25);
            this.game.load.spritesheet('llama-lizard-defense-hit', 'assets/llama/COLLIER/COLLIER_HIT.png', 470, 470, 18);
            this.game.load.spritesheet('llama-lizard-defense-victory', 'assets/llama/COLLIER/COLLIER_VICTORY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-lizard-defense-death', 'assets/llama/COLLIER/COLLIER_DEAD.png', 470, 470, 21);
            this.game.load.spritesheet('llama-lizard-defense-spit', 'assets/llama/COLLIER/COLLIER_ATTACK.png', 470, 470, 33);

            // Llama guettre assets
            this.game.load.spritesheet('llama-lizard-attack-attack', 'assets/llama/GUETTRE/GUETTRE_ATTACK.png', 470, 470, 33);
            this.game.load.spritesheet('llama-lizard-attack-idle', 'assets/llama/GUETTRE/GUETTRE_IDLE.png', 470, 470, 25);
            this.game.load.spritesheet('llama-lizard-attack-hit', 'assets/llama/GUETTRE/GUETTRE_HIT.png', 470, 470, 18);
            this.game.load.spritesheet('llama-lizard-attack-victory', 'assets/llama/GUETTRE/GUETTRE_VICTORY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-lizard-attack-death', 'assets/llama/GUETTRE/GUETTRE_DEAD.png', 470, 470, 21);

            // Llama armor assets
            this.game.load.spritesheet('llama-bird-defense-attack', 'assets/llama/PLASTRON/PLASTRON_ATTACK.png', 470, 470, 33);
            this.game.load.spritesheet('llama-bird-defense-idle', 'assets/llama/PLASTRON/PLASTRON_IDLE.png', 470, 470, 25);
            this.game.load.spritesheet('llama-bird-defense-hit', 'assets/llama/PLASTRON/PLASTRON_HIT.png', 470, 470, 18);
            this.game.load.spritesheet('llama-bird-defense-victory', 'assets/llama/PLASTRON/PLASTRON_VICTORY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-bird-defense-death', 'assets/llama/PLASTRON/PLASTRON_DEAD.png', 470, 470, 21);
            this.game.load.spritesheet('llama-bird-defense-spit', 'assets/llama/PLASTRON/PLASTRON_ATTACK.png', 470, 470, 33);

            // Llama goggles assets
            this.game.load.spritesheet('llama-bird-attack-attack', 'assets/llama/LUNETTE/LUNETTE_ATTACK.png', 470, 470, 33);
            this.game.load.spritesheet('llama-bird-attack-idle', 'assets/llama/LUNETTE/LUNETTE_IDLE.png', 470, 470, 25);
            this.game.load.spritesheet('llama-bird-attack-hit', 'assets/llama/LUNETTE/LUNETTE_HIT.png', 470, 470, 18);
            this.game.load.spritesheet('llama-bird-attack-victory', 'assets/llama/LUNETTE/LUNETTE_VICTORY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-bird-attack-death', 'assets/llama/LUNETTE/LUNETTE_DEAD.png', 470, 470, 21);

            // FX
            this.game.load.spritesheet('attack-bird', 'assets/fxs/lunettes_fx.png', 720, 470, 24);
            this.game.load.spritesheet('attack-spit', 'assets/fxs/crachat-fx.png', 720, 470, 24);
            this.game.load.spritesheet('attack-lizard', 'assets/fxs/guetre_fx.png', 720, 470, 24);
            this.game.load.spritesheet('attack-sun', 'assets/fxs/solarcanon_fx.png', 720, 470, 24);

            // coin assets
            this.game.load.spritesheet('coin_sun', 'assets/token_sun.png', 90, 90, 3);
            this.game.load.spritesheet('coin_bird', 'assets/token_bird.png', 90, 90, 3);
            this.game.load.spritesheet('coin_lizard', 'assets/token_lizard.png', 90, 90, 3);

            // Upgrade assets
            this.game.load.image('choice_Upgrade', 'assets/choice.png');

            this.game.load.image('craft', 'assets/player_selected.png');
            // end screen asset
            this.game.load.image('happy-end', 'assets/llama-happy-end.png');
            //Credit
            this.game.load.image('credit', 'assets/Bg_menu_credit.png');
            //Logo
            this.game.load.image('logo', 'assets/ui/LOGO.png')
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
