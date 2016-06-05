define(function () {
    "use strict";

    var Credit = function (game) {
    };

    Credit.prototype = {
        create: function () {

            this.credit_image=this.game.add.sprite(50,500,'craft');
            this.credit_image.anchor.set(0.5, 0.5);
            var text="LLAMAZORD\n\n\n Adrian\nBemba\nCaroline\nCyrielle\nElsa\nRémi\nYendhi\n";

            var credit_text = this.game.add.text(this.game.world.centerX, 325, text, { font: "50px Arial", fill: "White", align: "center" });
            credit_text.anchor.setTo(0.5,0.5);





        },
        update : function(){
            if (this.game.input.activePointer.isDown)
                {
                    this.onClick();
                }
        },
        onClick: function(){
           // console.log("salut boris");
            this.game.state.start('Menu');
        }
    };

    return Credit;
});