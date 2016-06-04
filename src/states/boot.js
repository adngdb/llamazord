define(function() {

    var Boot = function (game) {
    };

    Boot.prototype = {
        init: function () {
        },

        preload: function () {
            this.load.image('preloaderBackground', 'assets/gfx/progress_bar_fg.png');
            this.load.image('preloaderBar', 'assets/gfx/progress_bar_bg.png');
            this.load.image('preloaderText', 'assets/gfx/loading.png');
        },

        create: function () {
            this.state.start('Preloader');
        }
    };

    return Boot;
});
