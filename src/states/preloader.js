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
            this.game.load.spritesheet('btn-sound-on', 'assets/ui/btn-sound-on.png', 56, 56, 3);
            this.game.load.spritesheet('btn-sound-muted', 'assets/ui/btn-sound-muted.png', 56, 56, 3);

            // Upgrades.
            this.game.load.image('upgrade-sun-attack', 'assets/upgrades/solarcanon.png');
            this.game.load.image('upgrade-sun-defense', 'assets/upgrades/helmet.png');
            this.game.load.image('upgrade-lizard-attack', 'assets/upgrades/guettre.png');
            this.game.load.image('upgrade-lizard-defense', 'assets/upgrades/collar.png');
            this.game.load.image('upgrade-bird-attack', 'assets/upgrades/goggles.png');
            this.game.load.image('upgrade-bird-defense', 'assets/upgrades/armor.png');

            // Health bars
            this.game.load.image('health-bar', 'assets/ui/health-bars/bar.png');
            this.game.load.image('health-bar-back-brown', 'assets/ui/health-bars/bar-back-brown.png');
            this.game.load.image('health-bar-back-gray', 'assets/ui/health-bars/bar-back-gray.png');
            this.game.load.image('health-back-brown', 'assets/ui/health-bars/back-brown.png');
            this.game.load.image('health-back-gray', 'assets/ui/health-bars/back-gray.png');

            // Game state stuff
            this.game.load.image('player_background', 'assets/player_background.png');
            this.game.load.image('grid', 'assets/grid.png');
            this.game.load.image('grid-front', 'assets/grid-front.png');
            this.game.load.image('arena', 'assets/arena.png');
            this.game.load.image('filter', 'assets/filter.png');

            // Llama assets.
            // - player 1
            this.game.load.spritesheet('llama-0-attack', 'assets/llama/LLAMA_NUDE_BROWN/ATTACK_NUDE_BROWN.png', 470, 470, 33);
            this.game.load.spritesheet('llama-0-spit', 'assets/llama/LLAMA_NUDE_BROWN/ATTACK_SPIT_NUDE_BROWN.png', 470, 470, 43);
            this.game.load.spritesheet('llama-0-death', 'assets/llama/LLAMA_NUDE_BROWN/DEAD_NUDE_BROWN.png', 470, 470, 21);
            this.game.load.spritesheet('llama-0-hit', 'assets/llama/LLAMA_NUDE_BROWN/HIT_NUDE_BROWN.png', 470, 470, 18);
            this.game.load.spritesheet('llama-0-idle', 'assets/llama/LLAMA_NUDE_BROWN/IDLE_NUDE_BROWN.png', 470, 470, 25);
            this.game.load.spritesheet('llama-0-victory', 'assets/llama/LLAMA_NUDE_BROWN/VICTORY_NUDE_BROWN.png', 470, 470, 34);

            // - player 2
            this.game.load.spritesheet('llama-1-attack', 'assets/llama/LLAMA_NUDE_GREY/ATTACK_NUDE_GREY.png', 470, 470, 33);
            this.game.load.spritesheet('llama-1-spit', 'assets/llama/LLAMA_NUDE_GREY/ATTACK_SPIT_NUDE_GREY.png', 470, 470, 43);
            this.game.load.spritesheet('llama-1-death', 'assets/llama/LLAMA_NUDE_GREY/DEAD_NUDE_GREY.png', 470, 470, 21);
            this.game.load.spritesheet('llama-1-hit', 'assets/llama/LLAMA_NUDE_GREY/HIT_NUDE_GREY.png', 470, 470, 18);
            this.game.load.spritesheet('llama-1-idle', 'assets/llama/LLAMA_NUDE_GREY/IDLE_NUDE_GREY.png', 470, 470, 25);
            this.game.load.spritesheet('llama-1-victory', 'assets/llama/LLAMA_NUDE_GREY/VICTORY_NUDE_GREY.png', 470, 470, 34);

            // Llama helmet assets
            // - player 1
            this.game.load.spritesheet('llama-sun-defense-attack-0', 'assets/llama/CASQUE_BROWN/CASQUE_ATTACK_BROWN.png', 470, 470, 33);
            this.game.load.spritesheet('llama-sun-defense-idle-0', 'assets/llama/CASQUE_BROWN/CASQUE_IDLE_BROWN.png', 470, 470, 25);
            this.game.load.spritesheet('llama-sun-defense-hit-0', 'assets/llama/CASQUE_BROWN/CASQUE_HIT_BROWN.png', 470, 470, 18);
            this.game.load.spritesheet('llama-sun-defense-victory-0', 'assets/llama/CASQUE_BROWN/CASQUE_VICTORY_BROWN.png', 470, 470, 34);
            this.game.load.spritesheet('llama-sun-defense-death-0', 'assets/llama/CASQUE_BROWN/CASQUE_DEAD_BROWN.png', 470, 470, 21);
            this.game.load.spritesheet('llama-sun-defense-spit-0', 'assets/llama/CASQUE_BROWN/CASQUE_ATTACK_SPIT_BROWN.png', 470, 470, 43);

            // - player 2
            this.game.load.spritesheet('llama-sun-defense-attack-1', 'assets/llama/CASQUE_GREY/CASQUE_ATTACK_GREY.png', 470, 470, 33);
            this.game.load.spritesheet('llama-sun-defense-idle-1', 'assets/llama/CASQUE_GREY/CASQUE_IDLE_GREY.png', 470, 470, 25);
            this.game.load.spritesheet('llama-sun-defense-hit-1', 'assets/llama/CASQUE_GREY/CASQUE_HIT_GREY.png', 470, 470, 18);
            this.game.load.spritesheet('llama-sun-defense-victory-1', 'assets/llama/CASQUE_GREY/CASQUE_VICTORY_GREY.png', 470, 470, 34);
            this.game.load.spritesheet('llama-sun-defense-death-1', 'assets/llama/CASQUE_GREY/CASQUE_DEAD_GREY.png', 470, 470, 21);
            this.game.load.spritesheet('llama-sun-defense-spit-1', 'assets/llama/CASQUE_GREY/CASQUE_ATTACK_SPIT_GREY.png', 470, 470, 43);

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
            this.game.load.spritesheet('llama-lizard-defense-spit', 'assets/llama/COLLIER/COLLIER_ATTACK_SPIT.png', 470, 470, 33);

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
            this.game.load.spritesheet('llama-bird-defense-spit', 'assets/llama/PLASTRON/PLASTRON_ATTACK_SPIT.png', 470, 470, 33);

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
            this.game.load.audio('coins-break', 'assets/sfx/coins-break.ogg');
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
