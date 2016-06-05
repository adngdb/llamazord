define([
    'constants',
    'classes/Player',
    'classes/Coin',
],
function (constants, Player, Coin) {
    "use strict";

    const PLAYER_ACTION_STATE = 'PLAYER_ACTION_STATE';
    const GRID_SOLVING_STATE = 'GRID_SOLVING_STATE';
    const UPGRADE_STATE = 'UPGRADE_STATE';
    const COMBAT_RESOLVE_STATE = 'COMBAT_RESOLVE_STATE';
    const COMBAT_ANIM_STATE = 'COMBAT_ANIM_STATE';
    const GAME_OVER_STATE = 'GAME_OVER_STATE';
    const WAIT_RESET_STATE = 'WAIT_RESET_STATE';

    const NO_COIN = 'NO_COIN';

    var Game = function (game) {
        // grid format : [GRID_WIDTH][GRID_HEIGHT]
        this.grid = [];

        this.currentCoin = 'coin_sun';
        this.currentPlayer = 0;

        this.players = [];

        this.gameState = PLAYER_ACTION_STATE;
        this.actionIsDone = false;
        this.choosingUpgrade = false;
        this.roundActionsCount = 0;
        this.playerUpgrades = [];
        this.animsStack = [];

        this.fx = {};
        this.animating = 0;

        // all coin images
        this.coinSun = null;
        this.coinBird = null;
        this.coinLizard = null;
    };

    Game.prototype = {
        update: function () {

            if (this.animating != 0) {
                return;
            }
            switch (this.gameState) {
                case PLAYER_ACTION_STATE:
                    this.handlePlayerAction();
                    break;
                case GRID_SOLVING_STATE:
                    this.handleGridSolving();
                    break;
                case UPGRADE_STATE:
                    this.handleUpgrade();
                    break;
                case COMBAT_RESOLVE_STATE:
                    this.handleCombatResolution();
                    break;
                case COMBAT_ANIM_STATE:
                    this.handleCombatAnimation();
                    break;
                case GAME_OVER_STATE:
                    this.handleGameOver();
                    break;
            }
        },

        preload: function() {

            // Init grid structure.
            for (var i = 0; i < constants.game.GRID_WIDTH; ++i) {
                this.grid[i] = [];
                for (var j = 0; j < constants.game.GRID_HEIGHT; ++j) {
                    this.grid[i][j] = new Coin();
                }
            }
        },

        create: function () {


            // set background sprite
            var background = this.game.add.sprite(this.game.world.centerX, 560, 'player_background');
            background.anchor.set(0.5, 0.5);

            // set arena background
            var arena = this.game.add.sprite(
                this.game.world.centerX,
                constants.stage.ARENA_HEIGHT / 2,
                'arena'
            );
            arena.anchor.set(0.5, 0.5);

            // set grid sprite
            this.gridSprite = this.game.add.sprite(
                this.game.world.centerX,
                constants.stage.HEIGHT - (constants.stage.CELL_SIZE * (constants.game.GRID_HEIGHT + 2) / 2),
                'grid'
            );
            this.gridSprite.anchor.set(0.5, 0.5);

            this.gridFront = this.game.add.sprite(
                this.game.world.centerX,
                constants.stage.HEIGHT - (constants.stage.CELL_SIZE * (constants.game.GRID_HEIGHT + 2) / 2),
                'grid-front'
            );
            this.gridFront.inputEnabled = true;
            this.gridFront.anchor.set(0.5, 0.5);
            this.gridFront.events.onInputUp.add(this.onClick,this);

            // Create coin choice sprites.
            function setCurrentCoin(ctx, coin) {
                return function () {
                    ctx.currentCoin = coin;

                    // reset coin
                    ctx.coinSun.setFrames(1, coin=='coin_sun'? 2:0);
                    ctx.coinBird.setFrames(1, coin=='coin_bird'? 2:0);
                    ctx.coinLizard.setFrames(1, coin=='coin_lizard'? 2:0);
                };
            }

            function createCoin(ctx, name, x) {
                var coin = ctx.game.add.button(
                    x,
                    600,
                    name,
                    setCurrentCoin(ctx, name),
                    this,
                    1, (name=='coin_sun'? 2:0)
                );
                coin.anchor.set(0.5, 0.5);
                return coin;
            }

            this.coinSun = createCoin(this, 'coin_sun', this.game.world.centerX);
            this.coinBird = createCoin(this, 'coin_bird', this.game.world.centerX + constants.stage.CELL_SIZE);
            this.coinLizard = createCoin(this, 'coin_lizard', this.game.world.centerX - constants.stage.CELL_SIZE);

            // create GUI
            this.createGUI();

            //Upgrade GUI
            this.choice_Upgrade = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'choice_Upgrade');
            this.choice_Upgrade.anchor.set(0.5, 0.5);
            this.attack = this.game.add.sprite(this.game.world.centerX + 45, this.game.world.centerY, 'attack');
            this.attack.anchor.set(0.5, 0.5);
            this.defense = this.game.add.sprite(this.game.world.centerX - 45, this.game.world.centerY, 'defense');
            this.defense.anchor.set(0.5, 0.5);

            // start audio
            this.game.sound.stopAll();
            this.game.sound.play('ambiance', 0.5, true);

            // restart GUI
            this.replayButton = this.game.add.button(
                this.game.world.centerX,
                470+405,
                'happy-end',
                this.replayButtonOnClick,
                this,
                2, 1, 0
            );
            this.replayButton.anchor.set(0.5, 0.5);

            // create players
            this.players[0] = new Player(this.game, 0);
            this.players[1] = new Player(this.game, 1);

            this.createFx('goggles');

            // set / reset all default value for a new game
            this.resetGame();

        },

        createFx: function (name) {
            var fx = this.game.add.sprite(
                this.game.world.centerX,
                235,
                'attack-' + name
            );
            fx.anchor.set(0.5, 0.5);
            var anim = fx.animations.add('run');
            this.fx[name] = {
                anim: anim,
                sprite: fx,
            };
        },

        resetGame: function() {
            // hide GUI buttons
            this.replayButton.visible = false;
            this.attack.visible = false;
            this.choice_Upgrade.visible = false;
            this.defense.visible = false;

            // reset players
            this.players[0].defaultStatePlayer();
            this.players[1].defaultStatePlayer();

            // reset grid structure.
            for (var i = 0; i < constants.game.GRID_WIDTH; ++i) {
                for (var j = 0; j < constants.game.GRID_HEIGHT; ++j) {
                    this.grid[i][j].resetCoin();
                }
            }

             //creation player
            var player1 = this.game.add.text(80, 490, "Player 1", { font: "30px Arial", fill: "White", align: "center" });
            player1.anchor.setTo(0.5, 0.5);

            var player2 = this.game.add.text(630, 490, "Player 2", { font: "30px Arial", fill: "White", align: "center" });
            player2.anchor.setTo(0.5, 0.5);

            //select player
            this.play1 = this.game.add.sprite(83,620,'craft');
            this.play1.anchor.set(0.5, 0.5);
            this.play2 = this.game.add.sprite(635,620,'craft');
            this.play2.anchor.set(0.5, 0.5);
            this.play2.visible = false;
        },

        handlePlayerAction: function () {
            if (this.actionIsDone) {
                this.actionIsDone = false;
                this.roundActionsCount++;
                this.changeState(GRID_SOLVING_STATE);
            }
        },

        handleGridSolving: function () {
            var matches = this.getAllMatchs();

            if (matches.length) {
                // Stack player upgrades.
                console.log("All matches");
                for (var i=0; i<matches.length; ++i) {
                    this.playerUpgrades.push(this.grid[matches[i][0][0]][matches[i][0][1]].value);
                }
                // Remove the matches.

                for (var i=0; i<matches.length; ++i) {
                    for (var j=0; j<matches[i].length; ++j) {
                        var currCell = this.grid[matches[i][j][0]][matches[i][j][1]];
                        if (currCell.value != NO_COIN) {
                            currCell.value = NO_COIN;
                            currCell.sprite.kill();
                            currCell.sprite = null;
                        }
                    }
                }

                // Animate the falling pieces.
                for (var i=0; i< constants.game.GRID_WIDTH; ++i) {
                    for (var j=constants.game.GRID_HEIGHT-1; j>=0; --j) {
                        if (this.grid[i][j].value == NO_COIN) {
                            continue;
                        }
                        var firstAvailableCell = this.getLine(i);
                        if (firstAvailableCell > j) {
                            console.log("move from : [" + i + "," + j + "] to [" + i + "," + firstAvailableCell + "]");
                            var currTween = this.game.add.tween(this.grid[i][j].sprite);
                            var ydestination = constants.stage.HEIGHT - (constants.game.GRID_HEIGHT - firstAvailableCell) * constants.stage.CELL_SIZE;
                            var currY = constants.stage.HEIGHT - (constants.game.GRID_HEIGHT - j) * constants.stage.CELL_SIZE;
                            currTween.to({ y: ydestination }, (ydestination - currY) * 2 );
                            currTween.start();
                            ++this.animating;
                            currTween.onComplete.add(this.onCoinTweenFinished.bind(this));
                            // update "new" position
                            this.grid[i][firstAvailableCell].sprite = this.grid[i][j].sprite;
                            this.grid[i][firstAvailableCell].value = this.grid[i][j].value;
                            // update "old" position
                            this.grid[i][j].sprite = null;
                            this.grid[i][j].value = NO_COIN;

                        }
                    }
                }

            }
            // When the grid is stable, go to the next player and state.
            else {
                if (this.playerUpgrades.length) {
                    this.changeState(UPGRADE_STATE);
                }
                else {
                    if (this.roundActionsCount === 6) {
                        // Note that we do not change the current player. The
                        // player that plays last this round will play first
                        // next round.
                        this.changeState(COMBAT_RESOLVE_STATE);
                        this.roundActionsCount = 0;
                    }
                    else {
                        this.changePlayer();
                        this.changeState(PLAYER_ACTION_STATE);
                    }
                }
            }
        },

        handleUpgrade: function () {
            if (this.choosingUpgrade) {
                return;
            }

            var upgrade = this.playerUpgrades.pop();

            if (upgrade) {
                // Propose the next upgrade.
                this.choosingUpgrade = true;

                // Create a new group for this upgrade panel.
                var upgradeGroup = this.game.add.group();

                function chooseUpgrade(type, family) {
                    return function () {
                        this.players[this.currentPlayer].addUpdate(family, type);
                        upgradeGroup.destroy();
                        this.choosingUpgrade = false;
                    };
                }

                var back = this.game.make.sprite(
                    this.game.world.centerX,
                    this.game.world.centerY,
                    'choice_Upgrade'
                );
                back.anchor.set(0.5, 0.5);
                upgradeGroup.add(back);

                var attackBtn = this.game.make.button(
                    this.game.world.centerX + 45,
                    this.game.world.centerY,
                    'attack',
                    chooseUpgrade(0, upgrade),
                    this
                );
                attackBtn.anchor.set(0.5, 0.5);
                upgradeGroup.add(attackBtn);

                var defenseBtn = this.game.make.button(
                    this.game.world.centerX - 45,
                    this.game.world.centerY,
                    'defense',
                    chooseUpgrade(1, upgrade),
                    this
                );
                defenseBtn.anchor.set(0.5, 0.5);
                upgradeGroup.add(defenseBtn);
            }
            else {
                // All upgrades are done, go to the next state.
                if (this.roundActionsCount === 6) {
                    // Note that we do not change the current player. The
                    // player that plays last this round will play first
                    // next round.
                    this.changeState(COMBAT_RESOLVE_STATE);
                }
                else {
                    this.changePlayer();
                    this.changeState(PLAYER_ACTION_STATE);
                }
            }
        },

        handleCombatResolution: function () {
            var player0NoPower = true;
            var player1NoPower = true;

            for (var i = 0; i < 3; ++i) {
                // player 0 attack
                var player0Attack = this.players[0].upgradeTable[i][0];
                var player1Defense = this.players[1].upgradeTable[i][1];

                if (player0Attack != 0) {
                    this.players[1].hit((player0Attack + 1) / (player1Defense + 1));
                    player0NoPower = false;

                    // Set the corresponding animation.
                    this.animsStack.push(['attack', 'hit', 'goggles']);
                }

                // player 1 attack
                var player1Attack = this.players[1].upgradeTable[i][0];
                var player0Defense = this.players[0].upgradeTable[i][1];
                if (player1Attack != 0) {
                    this.players[0].hit((player1Attack+1)/(player0Defense+1));
                    player1NoPower = false;

                    // Set the corresponding animation.
                    this.animsStack.push(['hit', 'attack', '-goggles']);
                }
            }
            if (player0NoPower) {
                // Attack "jet d'eau P0"
                this.players[1].hit(1);

                // Set the corresponding animation.
                this.animsStack.push(['spit', 'hit', 'goggles']);
            }

            if (player1NoPower) {
                // Attack "jet d'eau P1"
                this.players[0].hit(1);
                this.animsStack.push(['hit', 'spit', '-goggles']);
            }

            this.changeState(COMBAT_ANIM_STATE);
        },

        handleCombatAnimation: function () {
            if (this.animating > 0) {
                return;
            }

            if (this.animsStack.length) {
                // Run the next stack of animations.
                var stack = this.animsStack.pop();

                this.animating += 3;
                this.players[0].animate(stack[0], false, this.onAnimationFinished.bind(this));
                this.players[1].animate(stack[1], false, this.onAnimationFinished.bind(this));

                var anim = stack[2];
                if (anim.charAt(0) === '-') {
                    anim = anim.slice(1, anim.length);
                    this.fx[anim].sprite.scale.x = -1;
                }
                else {
                    this.fx[anim].sprite.scale.x = 1;
                }
                this.fx[anim].anim.play(24);
                this.fx[anim].anim.onComplete.addOnce(this.onAnimationFinished.bind(this));
            }
            else {
                if (this.players[0].health < 0 || this.players[1].health < 0) {
                    this.changeState(GAME_OVER_STATE);
                }
                else {
                    this.changeState(PLAYER_ACTION_STATE);
                }
            }
        },

        handleGameOver: function () {
            // TODO
            console.log('Game Over');
            //

            this.players[0].animate(this.players[0].health > 0 ? 'victory': 'death', this.players[0].health > 0);
            this.players[1].animate(this.players[1].health > 0 ? 'victory': 'death', this.players[1].health > 0);
            this.changeState(WAIT_RESET_STATE);

            this.replayButton.visible = true;
            this.replayButton.bringToTop();
        },

        replayButtonOnClick: function () {
            console.log('restart game');
            this.game.state.remove('Game');
            this.game.state.start('Menu');
        },

        changePlayer: function () {
            this.currentPlayer = 1 - this.currentPlayer;
            console.log('Player now playing: ' + this.currentPlayer);

            if(this.currentPlayer==0){
            this.play1.visible = true;
            this.play2.visible = false;
            }
            else{
                this.play1.visible = false;
                this.play2.visible = true;

            }
        },

        changeState: function (state) {
            if (state === PLAYER_ACTION_STATE) {
                this.players[0].animate('idle');
                this.players[1].animate('idle');
            }

            var oldState = this.gameState;
            this.gameState = state;
            console.log('State: ' + oldState + ' -> ' + state);
        },

        onClick: function() {
            if (this.gameState != PLAYER_ACTION_STATE || this.animating != 0) {
                return;
            }

            var xClickPos = this.input.activePointer.x;

            var column = this.getColumn(xClickPos);
            if (column < 0 || column >= constants.game.GRID_WIDTH) {
                return;
            }
            var line = this.getLine(column);

            if (line == -1) {
                // No space in column
                this.invalidColumn();
            } else {
                // console.log("set coin in : " + column +" "+ line);
                // TODO: set the "right" coin type
                var newSprite = this.createCoin(
                    column,
                    constants.stage.HEIGHT - (constants.game.GRID_HEIGHT - line) * constants.stage.CELL_SIZE
                );
                // create coin
                this.grid[column][line].sprite = newSprite;
                this.grid[column][line].value = this.currentCoin;
                this.actionIsDone = true;
            }
            this.game.sound.play('sliding');
        },

        createGUI: function () {
        },

        getAllMatchs: function() {
            var matchs = [];
            // bottom right
            var diagStartX = 0;
            var diagStartY = constants.game.GRID_HEIGHT-3;
            while (diagStartX < constants.game.GRID_WIDTH-2) {
                //
                var currX = diagStartX;
                var currY = diagStartY;
                while(currY < constants.game.GRID_HEIGHT-2) {
                    var currentCell = this.grid[currX][currY];
                    var tmp = 1;
                    if (currentCell.value != NO_COIN) {
                        var currentMatch = [[currX,currY]];
                        while (currX+tmp < constants.game.GRID_WIDTH
                            && currY+tmp < constants.game.GRID_HEIGHT
                            && currentCell.value == this.grid[currX+tmp][currY+tmp].value) {
                            currentMatch.push([currX+tmp, currY+tmp]);
                            ++tmp;
                        }
                        if (tmp >= 5) {
                            console.log(" match diag BR: 5" );
                            // 5 coin aligned
                            matchs.push(currentMatch.slice(0,3));
                            matchs.push(currentMatch.slice(2));
                        } else if (tmp >= 3) {
                            console.log(" match diag BR: 3" );
                            // 3 or 4 aligned
                            matchs.push(currentMatch);
                        }
                    }
                    currX += tmp;
                    currY += tmp;
                }
                // next diagonal
                if (diagStartY != 0) {
                    --diagStartY;
                } else {
                    ++diagStartX;
                }
            }

            // right
            for (var j=0; j< constants.game.GRID_HEIGHT; ++j) {
                var cptX = 0;
                while(cptX < constants.game.GRID_WIDTH-2) {
                    var currentCell = this.grid[cptX][j];
                    var tmpX = 1;
                    if (currentCell.value != NO_COIN) {
                        var currentMatch = [[cptX,j]];
                        while (cptX+tmpX< constants.game.GRID_WIDTH && currentCell.value == this.grid[cptX+tmpX][j].value) {
                            currentMatch.push([cptX+tmpX, j]);
                            ++tmpX;
                        }
                        if (tmpX >= 5) {
                            console.log(" match right : 5" );
                            // 5 coin aligned
                            matchs.push(currentMatch.slice(0,3));
                            matchs.push(currentMatch.slice(2));
                        } else if (tmpX >= 3) {
                            console.log(" match right : 3" );
                            // 3 or 4 aligned
                            matchs.push(currentMatch);
                        }
                    }
                    cptX += tmpX;
                }
            }
            // upper right
            var diagStartX = 0;
            var diagStartY = 2;
            while (diagStartX < constants.game.GRID_WIDTH-2) {
                //
                var currX = diagStartX;
                var currY = diagStartY;
                while(currY > 2) {
                    var currentCell = this.grid[currX][currY];
                    var tmp = 1;
                    if (currentCell.value != NO_COIN) {
                        var currentMatch = [[currX,currY]];
                        while (currX+tmp < constants.game.GRID_WIDTH
                            && currY-tmp >= 0
                            && currentCell.value == this.grid[currX+tmp][currY-tmp].value) {
                            currentMatch.push([currX+tmp, currY-tmp]);
                            ++tmp;
                        }
                        if (tmp >= 5) {
                            console.log(" match diag UR: 5" );
                            // 5 coin aligned
                            matchs.push(currentMatch.slice(0,3));
                            matchs.push(currentMatch.slice(2));
                        } else if (tmp >= 3) {
                            console.log(" match diag UR: 3" );
                            // 3 or 4 aligned
                            matchs.push(currentMatch);
                        }
                    }
                    currX += tmp;
                    currY -= tmp;
                }
                // next diagonal
                if (diagStartY != constants.game.GRID_HEIGHT-1) {
                    ++diagStartY;
                } else {
                    ++diagStartX;
                }
            }

            // upper
            for (var i=0; i< constants.game.GRID_WIDTH; ++i) {
                var cptY = constants.game.GRID_HEIGHT-1;
                while(cptY >2) {
                    var currentCell = this.grid[i][cptY];
                    var tmpY = 1;
                    if (currentCell.value != NO_COIN) {
                        var currentMatch = [[i,cptY]];
                        while (cptY-tmpY >= 0 && currentCell.value == this.grid[i][cptY-tmpY].value) {
                            currentMatch.push([i, cptY-tmpY]);
                            ++tmpY;
                        }
                        if (tmpY >= 3) {
                            console.log(" match up: 3" );
                            // 3 or 4 aligned
                            matchs.push(currentMatch);
                        }
                    }
                    cptY -= tmpY;
                }
            }

            return matchs;
        },

        removeMatchs: function() {
        },

        createCoin: function(column, ydestination) {
            var coinYStart = constants.stage.COIN_START_HEIGHT + constants.stage.CELL_SIZE/2;
            var coinXStart = (column + 1) * constants.stage.CELL_SIZE;

            var coin = this.game.add.sprite(coinXStart, coinYStart, this.currentCoin);
            //var coin = this.game.add.sprite(coinXStart, coinYStart, 'coin');
            coin.anchor.set(0.5, 0.5);
            var coinTween = this.game.add.tween(coin);

            coinTween.to({ y: ydestination }, (ydestination - coinYStart) );
            coinTween.start();
            coinTween.onComplete.add(this.onCoinTweenFinished.bind(this));

            this.gridFront.bringToTop();

            ++this.animating;
            return coin;
        },

        onCoinTweenFinished: function() {
            this.game.sound.play('hit');
            --this.animating;
        },

        onAnimationFinished: function () {
            --this.animating;
        },

        invalidColumn: function() {
            console.log("TODO : No place in column");
        },

        getColumn: function(xClickPos) {
            return Math.floor( (xClickPos - 45) / constants.stage.CELL_SIZE);
        },

        getLine: function (column) {
            var bottom = constants.game.GRID_HEIGHT -1;
            while (bottom >=0 && this.grid[column][bottom].value != NO_COIN) {
                --bottom;
            }

            return bottom;
        }

    };

    return Game;
});
