define(function () {
    "use strict";

    var Credit = function (game) {
    };

    Credit.prototype = {
        create: function () {
            var text="LLAMAZORD\n\n\nPROJECT DIRECTOR\n\n";

            var credit_text = this.game.add.text(this.game.world.centerX, 300, text, { font: "13px Arial", fill: "White", align: "center" });
            credit_text.anchor.setTo(0.5,0.5);

        },

        onCredit: function () {
            console.log('start game');
            this.game.state.start('Game');
        },
    };

    return Credit;
});