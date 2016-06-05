define([
    'constants'
],
function (constants) {
    var playersData = [
        {
            x: constants.stage.WIDTH / 4,
            y: constants.stage.ARENA_HEIGHT / 2,
            sprite: 'llama-raw-idle',
        },
        {
            x: constants.stage.WIDTH / 4 * 3,
            y: constants.stage.ARENA_HEIGHT / 2,
            sprite: 'llama-raw-idle',
        },
    ];

    const NORMAL_HIT = 16;
    const MAX_HEALTH = 200;

    var Player = function (game, number) {
        this.game = game;
        this.playerNumber = number;

        this.animNames = ['idle', 'hit', 'victory', 'death'];
        this.anims = {};
        this.sprites = {};

        this.llama = this.game.add.group();

        this.init();
    };

    Player.prototype = {
        init: function () {
            this.health = MAX_HEALTH;

            var playerData = playersData[this.playerNumber];

            for (var i = this.animNames.length - 1; i >= 0; i--) {
                var anim = this.animNames[i];
                var spriteName = 'llama-raw-' + anim;

                var sprite = this.llama.create(playerData.x, playerData.y, spriteName);
                sprite.anchor.set(0.5, 0.5);
                sprite.visible = false;
                this.anims[anim] = sprite.animations.add(anim);
                this.sprites[anim] = sprite;
            }

            if (this.playerNumber === 1) {
                this.llama.setAll('scale.x', -1);
            }

            this.animate('idle');
        },

        stopAllAnimations: function () {
            for (var i = this.animNames.length - 1; i >= 0; i--) {
                var anim = this.animNames[i];

                if (this.anims[anim].isPlaying) {
                    this.anims[anim].stop(true);
                    this.sprites[anim].visible = false;
                }
            }
        },

        animate: function (anim, loop) {
            if (typeof loop === 'undefined') {
                loop = true;
            }
            this.stopAllAnimations();
            this.sprites[anim].visible = true;
            this.anims[anim].play(24, loop);
        },

        hit: function(power) {
            console.log("BEFORE player : " + this.playerNumber + "| remaining health : " + this.health);
            if (power > 0) {
                this.health -= NORMAL_HIT * power;
            } else if (power < 0) {
                this.health -= NORMAL_HIT/power;
            } else {
                this.health -= NORMAL_HIT;
            }
            console.log("player : " + this.playerNumber + "| remaining health : " + this.health);
        }
    };

    return Player;
});
