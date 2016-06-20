define([
    'constants'
], function (constants) {
    return {
        setCurrentCoin: function (ctx, coin) {
            return function () {
                ctx.currentCoin = coin;

                // reset coin
                ctx.coinSun.setFrames(1, coin == 'coin_sun' ? 0 : 2);
                ctx.coinBird.setFrames(1, coin == 'coin_bird' ? 0 : 2);
                ctx.coinLizard.setFrames(1, coin == 'coin_lizard' ? 0 : 2);
            };
        },

        createCoinButton: function (ctx, name, x) {
            var coin = ctx.game.add.button(
                x,
                600,
                name,
                this.setCurrentCoin(ctx, name),
                ctx,
                1, 0
            );
            coin.anchor.set(.5, .5);
            return coin;
        },

        randomInt: function (max) {
            return Math.floor(Math.random() * max % max);
        },

        getRandomNamesPair: function () {
            var names = [
                [ 'Red', 'Blue' ],
                [ 'Jessie', 'James' ],
                [ 'Stone', 'Sharden' ],
                [ 'Starsky', 'Hutch' ],
                [ 'Blake', 'Mortimer' ],
                [ 'Romeo', 'Juliette' ],
                [ 'Holmes', 'Moriarty' ],
                [ 'Calvin', 'Hobbes' ],
                [ 'Tom', 'Jerry' ],
                [ 'Laurel', 'Hardy' ],
            ];

            var index = this.randomInt(names.length);
            return names[index];
        },

        createSoundBtns: function (game) {
            var x = constants.stage.WIDTH - 40;
            var y = 40;
            var btnOn;
            var btnOff;

            function muteSound() {
                this.sound.volume = 0;
                btnOff.visible = true;
                btnOn.visible = false;
            }

            function unmuteSound() {
                this.sound.volume = 1;
                btnOff.visible = false;
                btnOn.visible = true;
            }

            btnOn = game.add.button(
                x,
                y,
                'btn-sound-on',
                muteSound,
                game,
                1, 0, 2
            );
            btnOn.anchor.set(.5, .5);
            btnOff = game.add.button(
                x,
                y,
                'btn-sound-muted',
                unmuteSound,
                game,
                1, 0, 2
            );
            btnOff.anchor.set(.5, .5);

            if (game.sound.volume > 0) {
                btnOff.visible = false;
            }
            else {
                btnOn.visible = false;
            }
        },
    }
});
