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
    };

    return Coin;
});
