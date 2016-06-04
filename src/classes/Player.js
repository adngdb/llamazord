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

    var Player = function (game, number) {
        this.game = game;
        this.playerNumber = number;

        this.llama = this.game.add.group();

        this.init();
    };

    Player.prototype = {
        init: function () {
            this.health = constants.MAX_HEALTH;

            var playerData = playersData[this.playerNumber];
            var sprite = this.llama.create(playerData.x, playerData.y, playerData.sprite);
            sprite.anchor.set(0.5, 0.5);

            if (this.playerNumber === 1) {
                sprite.scale.x *= -1;
            }
        },
    };

    return Player;
});
