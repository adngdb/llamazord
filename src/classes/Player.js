define([
    'constants'
],
function (constants) {
    var Player = function () {
        this.health = constants.MAX_HEALTH;

        // image (Llama)
        this.llamaSprite = null;
    };

    Player.prototype = {
        init: function () {
            this.health = constants.MAX_HEALTH;
        },
    };

    return Player;
});
