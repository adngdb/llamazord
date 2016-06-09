define([
    'constants'
],
function (constants) {
    var playersData = [
        {
            x: constants.stage.WIDTH / 4,
            y: constants.stage.ARENA_HEIGHT / 2,
            sprite: 'llama-raw-idle',
        },
        {
            x: constants.stage.WIDTH / 4 * 3,
            y: constants.stage.ARENA_HEIGHT / 2,
            sprite: 'llama-raw-idle',
        },
    ];

    const NORMAL_HIT = 16;
    const MAX_HEALTH = 100;

    var Player = function (game, number, name) {
        this.game = game;
        this.playerNumber = number;
        this.name = name;

        this.upgradecounter = 0;

        this.animNames = ['idle', 'hit', 'victory', 'death', 'attack', 'spit'];
        this.upgradeSpriteNames = ['llama-sun','llama-lizard','llama-bird'];

        this.upgradeSprites = {};
        this.upgradeSpriteAnim ={};

        this.allSprites = {};
        this.allAnimations = {};

        // [Sun =>0  ; Lizard =>1 ; Bird=>2][attack =>0 ; deffence=>1]
        this.upgradeTable = [];

        this.llama = this.game.add.group();

        this.init();
    };

    Player.prototype = {
        init: function () {
            this.health = MAX_HEALTH;

            var playerData = playersData[this.playerNumber];

            // init animation
            for (var i = this.animNames.length - 1; i >= 0; i--) {
                var anim = this.animNames[i];
                var spriteName = 'llama-raw-' + anim;
                var sprite = this.llama.create(playerData.x, playerData.y, spriteName);
                sprite.anchor.set(0.5, 0.5);
                sprite.visible = false;

                var animObj = sprite.animations.add(anim);

                this.allSprites[anim] = [sprite];
                this.allAnimations[anim] = [animObj];
            }

            if (this.playerNumber === 1) {
                this.llama.setAll('scale.x', -1);
            }

            // Create health bar elements.
            var barX = this.game.world.centerX - 180;
            if (this.playerNumber === 1) {
                barX = this.game.world.centerX + 180;
            }
            var healthBarBack = this.game.add.sprite(
                barX,
                constants.stage.ARENA_HEIGHT + 180 / 2,
                'health-bar-back-gray'
            );
            healthBarBack.anchor.set(.5, .5);
            var healthBack = this.game.add.sprite(
                barX,
                constants.stage.ARENA_HEIGHT + 180 / 2,
                'health-back-gray'
            );
            healthBack.anchor.set(.5, .5);

            this.healthBar = this.game.add.sprite(
                barX,
                constants.stage.ARENA_HEIGHT + 180 / 2 + 82,
                'health-bar'
            );
            this.healthBar.anchor.set(.5, 1);
            this.healthBar.cropEnabled = true;
            this.healthBarHeight = this.healthBar.height;
        },

        defaultStatePlayer: function () {
            for(var i = 0 ; i<3; i++){
                this.upgradeTable[i] = [];
                for(var j =0 ; j<2;j++){
                    this.upgradeTable[i][j] = 0;
                }
            }
            this.animate('idle');
        },

        stopAllAnimations: function () {
            for (var i = this.animNames.length - 1; i >= 0; i--) {
                var anim = this.animNames[i];

                for (var j = this.allAnimations[anim].length - 1; j >= 0; j--) {
                    this.allAnimations[anim][j].stop(true);
                    this.allSprites[anim][j].visible = false;
                }
            }
        },

        animate: function (anim, loop, onComplete) {
            if (typeof loop === 'undefined') {
                loop = true;
            }

            this.stopAllAnimations();
            var playerData = playersData[this.playerNumber];

            for (var i = this.allSprites[anim].length - 1; i >= 0; i--) {
                var sprite = this.allSprites[anim][i];
                sprite.visible = true;

                var animObj = this.allAnimations[anim][i];
                animObj.play(24, loop);
                if (i === 0 && onComplete) {
                    animObj.onComplete.addOnce(onComplete);
                }
            }
        },

        addUpdate: function (coinType, upgradeType){
            var coinValue;
            var upgradeSpritePreName;
            switch(coinType){
                case 'coin_sun':
                    coinValue = 0;
                    break;
                case 'coin_lizard':
                    coinValue = 1;
                    break;
                case 'coin_bird':
                    coinValue = 2;
                    break;
            }

            if (this.upgradeTable[coinValue][upgradeType] == 0){

                var playerData = playersData[this.playerNumber];
                // check attack or defense
                switch (upgradeType){
                    case 0:
                        upgradeSpritePreName = this.upgradeSpriteNames[coinValue] + "-attack-";
                        break;
                    case 1:
                        upgradeSpritePreName = this.upgradeSpriteNames[coinValue] + "-defense-";
                        break;
                }
                //create sprite and animations
                for (var i = this.animNames.length - 1; i >= 0; i--) {
                    var anim = this.animNames[i];
                    var upgradeSpriteName = upgradeSpritePreName + anim;

                    var sprite = this.llama.create(playerData.x, playerData.y, upgradeSpriteName);
                    sprite.anchor.set(0.5, 0.5);
                    sprite.visible = false;

                    var animObj = sprite.animations.add(anim);

                    this.allSprites[anim].push(sprite);
                    this.allAnimations[anim].push(animObj);
                }

                if (this.playerNumber === 1) {
                    this.llama.setAll('scale.x', -1);
                }
            }

            this.upgradeTable[coinValue][upgradeType]++;
        },

        hit: function (power) {
            if (power > 0) {
                this.health -= NORMAL_HIT * power;
            } else if (power < 0) {
                this.health -= NORMAL_HIT / power;
            } else {
                this.health -= NORMAL_HIT;
            }

            if (this.health < 0) {
                this.health = 0;
            }

            console.log('Player ' + this.playerNumber + '\'s health: ' + this.health);

            // Update health bar.
            var lifeRatio = this.health / MAX_HEALTH;
            if (this.health > 0 && lifeRatio < .1) {
                lifeRatio = .1;
            }
            console.log('Health ratio: ' + lifeRatio);
            this.healthBar.crop({
                x: 0,
                y: Math.abs(lifeRatio * this.healthBarHeight - this.healthBarHeight),
                width: this.healthBar.width,
                height: this.healthBarHeight,
            });
        },
    };

    return Player;
});
