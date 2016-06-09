define({
    setCurrentCoin: function (ctx, coin) {
        return function () {
            ctx.currentCoin = coin;

            // reset coin
            ctx.coinSun.setFrames(1, coin == 'coin_sun' ? 2 : 0);
            ctx.coinBird.setFrames(1, coin == 'coin_bird' ? 2 : 0);
            ctx.coinLizard.setFrames(1, coin == 'coin_lizard' ? 2 : 0);
        };
    },

    createCoin: function (ctx, name, x) {
        var coin = ctx.game.add.button(
            x,
            600,
            name,
            this.setCurrentCoin(ctx, name),
            ctx,
            1, (name == 'coin_sun' ? 2 : 0)
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
});
