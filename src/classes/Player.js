define([
    'constants'
],
function (constants) {
    var playersData = [
        {
            x: constants.stage.WIDTH / 4,
            y: constants.stage.ARENA_HEIGHT / 2,
            sprite: 'llama',
        },
        {
            x: constants.stage.WIDTH / 4 * 3,
            y: constants.stage.ARENA_HEIGHT / 2,
            sprite: 'llama',
        },
    ];

    const NORMAL_HIT = 16;
    const MAX_HEALTH = 200;

    var Player = function (game, number) {
        this.game = game;
        this.playerNumber = number;

        this.llama = this.game.add.group();

        this.init();
    };

    Player.prototype = {
        init: function () {
            this.health = MAX_HEALTH;

            var playerData = playersData[this.playerNumber];
            var sprite = this.llama.create(playerData.x, playerData.y, playerData.sprite);
            sprite.anchor.set(0.5, 0.5);

            if (this.playerNumber === 1) {
                sprite.scale.x *= -1;
            }
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
