define([
    'constants'
],
function (constants) {
    var Coin = function () {
        this.value = 'NO_COIN'

        this.sprite = null;
    };

    Coin.prototype = {
        init: function () {
        },

        resetCoin:function () {
            this.value = 'NO_COIN'

            if (this.sprite) {
                this.sprite.destroy();
            }
            this.sprite = null;

        },
    };

    return Coin;
});
