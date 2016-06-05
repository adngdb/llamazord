define(function () {
    "use strict";

    var Credit = function (game) {
    };

    Credit.prototype = {
        create: function () {

            this.credit_image=this.game.add.sprite(350,600,'credit');
            this.credit_image.anchor.set(0.5, 0.5);

            this.logo=this.game.add.sprite(320,100,'logo');
            this.logo.anchor.set(0.5, 0.5);

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