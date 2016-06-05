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
    const MAX_HEALTH = 20;

    var Player = function (game, number) {
        this.game = game;
        this.playerNumber = number;

        this.animNames = ['idle', 'hit', 'victory', 'death'];
        this.upgradeSpriteNames = ['llama-sun','llama-lizard','llama-bird'];
        this.anims = {};
        this.sprites = {};
        this.upgradeSprites = {};
        this.upgradeSpriteAnim ={};

		// [Sun =>0  ; Lizard =>1 ; Bird=>2][attack =>0 ; deffence=>1]
		this.upgradeTable =[,];
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
                this.anims[anim] = sprite.animations.add(anim);
                this.sprites[anim] = sprite;
            }




            if (this.playerNumber === 1) {
                this.llama.setAll('scale.x', -1);
            }
        },

        defaultStatePlayer: function() {
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

                if (this.anims[anim].isPlaying) {
                    this.anims[anim].stop(true);
                }
                if (this.sprites[anim]) {
                    this.sprites[anim].visible = false;
                }
                if (this.upgradeSprites[anim]) {
                    this.upgradeSprites[anim].visible = false;
                }
            }
        },

        animate: function (anim, loop) {
            if (typeof loop === 'undefined') {
                loop = true;
            }

            this.stopAllAnimations();

            if (this.sprites[anim]) {
                this.sprites[anim].visible = true;
            }
            this.anims[anim].play(24, loop);

            if (this.upgradeSpriteAnim[anim]) {
                this.upgradeSprites[anim].visible = true;
                this.upgradeSpriteAnim[anim].play(24,loop);
            }
        },

        addUpdate : function(coinType, upgradeType){
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
                var upgradeSpriteName;
                var upgradeSprite;
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
                    var upAnim = this.animNames[i];
                    upgradeSpriteName =upgradeSpritePreName + upAnim;
                    var upgradeSprite = this.llama.create(playerData.x, playerData.y, upgradeSpriteName);
                    upgradeSprite.anchor.set(0.5, 0.5);
                    upgradeSprite.visible = false;
                    this.upgradeSprites[upAnim] = upgradeSprite;

                    this.upgradeSpriteAnim[upAnim] = upgradeSprite.animations.add(upAnim);
                }
                if (this.playerNumber === 1) {
                    this.llama.setAll('scale.x',-1);
                }


            }

            this.upgradeTable[coinValue][upgradeType]++;
            console.log('Upgrade bien ajouté : ' + coinType + " " + upgradeType);
        },

        hit: function(power) {
            if (power > 0) {
                this.health -= NORMAL_HIT * power;
            } else if (power < 0) {
                this.health -= NORMAL_HIT/power;
            } else {
                this.health -= NORMAL_HIT;
            }
            console.log("player : " + this.playerNumber + "| remaining health : " + this.health);
        }
    };


    return Player;
});
