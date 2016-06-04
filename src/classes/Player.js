define(
    ['constants'
],

    function (constants) {
    var Player = function () {
        this.health = constants.MAX_HEALTH;

        // image (Llama)
        this.sprite = null;
    };

    Player.prototype = {
        constructor: function() {

        },

        init: function() {

        }
    };

    return Player;
});
