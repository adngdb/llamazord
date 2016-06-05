define([
    'constants'
],
function (constants) {
    var Coin = function () {
        this.value = 'NO_COIN'

        // image (Llama)
        this.sprite = null;
    };

    Coin.prototype = {
        init: function () {
        },

        resetCoin:function () {
            this.value = 'NO_COIN'

            // image (Llama)
            if (this.sprite) {
                this.sprite.destroy();
            }
            this.sprite = null;

        },
    };

    return Coin;
});
