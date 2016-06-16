define([
    'constants',
    'utils',
    'classes/Player',
    'classes/Coin',
],
function (constants, utils, Player, Coin) {
    "use strict";

    const PLAYER_ACTION_STATE = 'PLAYER_ACTION_STATE';
    const GRID_SOLVING_STATE = 'GRID_SOLVING_STATE';
    const UPGRADE_STATE = 'UPGRADE_STATE';
    const COMBAT_RESOLVE_STATE = 'COMBAT_RESOLVE_STATE';
    const COMBAT_ANIM_STATE = 'COMBAT_ANIM_STATE';
    const GAME_OVER_STATE = 'GAME_OVER_STATE';
    const WAIT_RESET_STATE = 'WAIT_RESET_STATE';

    const NO_COIN = 'NO_COIN';

    const ACTIONS_NUMBER_PER_ROUND = 6;

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

        this.filter = null;

        this.fx = {};
        this.animating = 0;

        // all coin images
        this.coinSun = null;
        this.coinBird = null;
        this.coinLizard = null;
        this.animOrder = ['sun', 'lizard', 'bird', 'spit'];
    };

    Game.prototype = {
        update: function () {
            if (this.animating > 0) {
                return;
            }

            // A very basic state machine.
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

        init: function() {
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
            background.anchor.set(.5, .5);

            // set arena background
            var arena = this.game.add.sprite(
                this.game.world.centerX,
                constants.stage.ARENA_HEIGHT / 2,
                'arena'
            );
            arena.anchor.set(.5, .5);

            // set grid sprites
            this.gridSprite = this.game.add.sprite(
                this.game.world.centerX,
                constants.stage.HEIGHT - (constants.stage.CELL_SIZE * (constants.game.GRID_HEIGHT + 2) / 2),
                'grid'
            );
            this.gridSprite.anchor.set(.5, .5);

            this.gridFront = this.game.add.sprite(
                this.game.world.centerX,
                constants.stage.HEIGHT - (constants.stage.CELL_SIZE * (constants.game.GRID_HEIGHT + 2) / 2),
                'grid-front'
            );
            this.gridFront.inputEnabled = true;
            this.gridFront.anchor.set(.5, .5);
            this.gridFront.events.onInputUp.add(this.onClick,this);

            for (var i = this.animOrder.length - 1; i >= 0; --i) {
                this.createFx(this.animOrder[i]);
            }

            this.createGUI();

            // set / reset all default value for a new game
            this.resetGame();

            this.start();
        },

        start: function () {
            // start audio
            this.game.sound.stopAll();
            this.game.sound.play('ambiance', .5, true);

            // Create a random set of coins to populate the board.
            var previousCoin = -1;
            for (var i = 0; i < 7; i++) {
                var newCoin = utils.randomInt(3);
                while (newCoin === previousCoin) {
                    newCoin = utils.randomInt(3);
                }
                previousCoin = newCoin;

                var newSprite = this.createCoin(
                    constants.game.COIN_VALUES[newCoin],
                    i,
                    constants.game.GRID_HEIGHT - 1
                );
            }
        },

        createGUI: function () {
            this.replayButton = this.game.add.button(
                this.game.world.centerX,
                constants.stage.ARENA_HEIGHT + 405,
                'happy-end',
                this.replayButtonOnClick,
                this,
                2, 1, 0
            );
            this.replayButton.anchor.set(.5, .5);

            // create players
            var names = utils.getRandomNamesPair();
            this.players[0] = new Player(this.game, 0, names[0]);
            this.players[1] = new Player(this.game, 1, names[1]);

            // Create player turn status text.
            this.playerTurnStatus = this.game.add.text(
                this.game.world.centerX,
                constants.stage.ARENA_HEIGHT + 30,
                this.players[this.currentPlayer].name + '\'s turn',
                { font: "30px " + constants.stage.FONT, fill: "White", align: "center" }
            );
            this.playerTurnStatus.anchor.set(.5, .5);

            // Player texts.
            var player1Text = this.game.add.text(
                80,
                490,
                this.players[0].name,
                { font: "30px " + constants.stage.FONT, fill: "#FF5B5B", align: "center" }
            );
            player1Text.anchor.setTo(.5, .5);

            var player2Text = this.game.add.text(
                640,
                490,
                this.players[1].name,
                { font: "30px " + constants.stage.FONT, fill: "#00D0D8", align: "center" }
            );
            player2Text.anchor.setTo(.5, .5);

            // Create current player tokens.
            this.tokenPlayer1 = this.game.add.sprite(83, 620, 'craft');
            this.tokenPlayer1.anchor.set(.5, .5);
            this.tokenPlayer2 = this.game.add.sprite(635, 620, 'craft');
            this.tokenPlayer2.anchor.set(.5, .5);
            this.tokenPlayer2.visible = false;

            var chooseCoinText = this.game.add.text(
                this.game.world.centerX,
                constants.stage.ARENA_HEIGHT + 70,
                'Choose a coin:',
                { font: "24px " + constants.stage.FONT, fill: "White", align: "center" }
            );
            chooseCoinText.anchor.set(.5, .5);

            // Create coin choice sprites.
            this.coinSun = utils.createCoin(this, 'coin_sun', this.game.world.centerX);
            this.coinBird = utils.createCoin(this, 'coin_bird', this.game.world.centerX + constants.stage.CELL_SIZE);
            this.coinLizard = utils.createCoin(this, 'coin_lizard', this.game.world.centerX - constants.stage.CELL_SIZE);

            // Create sound muting buttons.
            utils.createSoundBtns(this.game);
        },

        createFx: function (name) {
            var fx = this.game.add.sprite(
                this.game.world.centerX,
                235,
                'attack-' + name
            );
            fx.anchor.set(.5, .5);
            fx.visible = false;

            var anim = fx.animations.add('run');

            this.fx[name] = {
                anim: anim,
                sprite: fx,
            };
        },

        resetGame: function() {
            // hide GUI buttons
            this.replayButton.visible = false;

            // reset players
            this.players[0].defaultStatePlayer();
            this.players[1].defaultStatePlayer();

            // reset grid structure.
            for (var i = 0; i < constants.game.GRID_WIDTH; ++i) {
                for (var j = 0; j < constants.game.GRID_HEIGHT; ++j) {
                    this.grid[i][j].resetCoin();
                }
            }
        },

        handlePlayerAction: function () {
            if (this.actionIsDone) {
                this.actionIsDone = false;
                this.roundActionsCount++;
                this.changeState(GRID_SOLVING_STATE);
            }
        },

        handleGridSolving: function () {
            var matches = this.getAllMatches();

            if (matches.length) {
                // Stack player upgrades.
                matches.forEach(function (items) {
                    this.playerUpgrades.push(
                        this.grid[ items[0][0] ][ items[0][1] ].value
                    );
                }.bind(this));

                // Remove the matches.
                matches.forEach(function (items) {
                    this.game.sound.play('coins-break');
                    items.forEach(function (cell) {
                        var currentCell = this.grid[ cell[0] ][ cell[1] ];
                        if (currentCell.value != NO_COIN) {
                            currentCell.value = NO_COIN;
                            currentCell.sprite.kill();
                            currentCell.sprite = null;
                        }
                    }.bind(this));
                }.bind(this));

                // Animate the falling pieces.
                for (var i = 0; i < constants.game.GRID_WIDTH; ++i) {
                    for (var j = constants.game.GRID_HEIGHT - 1; j >= 0; --j) {
                        if (this.grid[i][j].value == NO_COIN) {
                            continue;
                        }
                        var firstAvailableCell = this.getLine(i);
                        if (firstAvailableCell > j) {
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
                    if (this.roundActionsCount === ACTIONS_NUMBER_PER_ROUND) {
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

                function chooseUpgrade(family, type) {
                    return function () {
                        this.players[this.currentPlayer].addUpdate(family, type);
                        upgradeGroup.destroy();
                        this.choosingUpgrade = false;
                    };
                }

                var back = this.game.make.sprite(
                    this.game.world.centerX,
                    650 + 630 / 2,
                    'choice_Upgrade'
                );
                back.anchor.set(.5, .5);
                upgradeGroup.add(back);

                var family = upgrade.replace('coin_', '');

                var attackBtn = this.game.make.button(
                    this.game.world.centerX - 360 / 2,
                    constants.stage.HEIGHT - 540 / 2,
                    'upgrade-' + family + '-attack',
                    chooseUpgrade(upgrade, 0),
                    this
                );
                attackBtn.anchor.set(.5, .5);
                upgradeGroup.add(attackBtn);

                var defenseBtn = this.game.make.button(
                    this.game.world.centerX + 360 / 2,
                    650 + 90 + 540 / 2,
                    'upgrade-' + family + '-defense',
                    chooseUpgrade(upgrade, 1),
                    this
                );
                defenseBtn.anchor.set(.5, .5);
                upgradeGroup.add(defenseBtn);
            }
            else {
                // All upgrades are done, go to the next state.
                if (this.roundActionsCount === ACTIONS_NUMBER_PER_ROUND) {
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
                    this.animsStack.push([
                        'attack', 'hit', this.animOrder[i],
                        0, 1250, 500
                    ]);
                }

                // player 1 attack
                var player1Attack = this.players[1].upgradeTable[i][0];
                var player0Defense = this.players[0].upgradeTable[i][1];
                if (player1Attack != 0) {
                    this.players[0].hit((player1Attack + 1) / (player0Defense + 1));
                    player1NoPower = false;

                    // Set the corresponding animations.
                    this.animsStack.push([
                        'hit', 'attack', '-' + this.animOrder[i],
                        1250, 0, 500
                    ]);
                }
            }
            if (player0NoPower) {
                // Attack "jet d'eau P0"
                this.players[1].hit(1);

                // Set the corresponding animation.
                this.animsStack.push([
                    'spit', 'hit', this.animOrder[3],
                    0, 1000, 840
                ]);
            }

            if (player1NoPower) {
                // Attack "jet d'eau P1"
                this.players[0].hit(1);
                this.animsStack.push([
                    'hit', 'spit', '-' + this.animOrder[3],
                    1000, 0, 840
                ]);
            }

            this.changeState(COMBAT_ANIM_STATE);
        },

        handleCombatAnimation: function () {
            if (this.animsStack.length) {
                // Run the next stack of animations.
                var stack = this.animsStack.pop();
                var timer = this.game.time.create(true);

                function playAnimation(ctx, stack, index, callback) {
                    return function () {
                        ctx.players[index].animate(stack[index], false, callback);
                    };
                }

                timer.add(stack[3] || 0, playAnimation(this, stack, 0, this.onAnimationFinished.bind(this)));
                timer.add(stack[4] || 0, playAnimation(this, stack, 1, this.onAnimationFinished.bind(this)));

                var anim = stack[2];
                if (anim.charAt(0) === '-') {
                    anim = anim.slice(1, anim.length);
                    this.fx[anim].sprite.scale.x = -1;
                }
                else {
                    this.fx[anim].sprite.scale.x = 1;
                }
                function playFx(ctx, anim, callback) {
                    return function () {
                        ctx.fx[anim].sprite.visible = true;
                        ctx.fx[anim].sprite.bringToTop();
                        ctx.fx[anim].anim.play(24);
                        ctx.fx[anim].anim.onComplete.addOnce(callback);
                    };
                }
                timer.add(stack[5] || 0, playFx(this, anim, this.onAnimationFinished.bind(this)));

                this.animating += 3;
                timer.start();
            }
            else {
                if (this.players[0].health <= 0 || this.players[1].health <= 0) {
                    this.changeState(GAME_OVER_STATE);
                }
                else {
                    this.changeState(PLAYER_ACTION_STATE);
                }
            }
        },

        handleGameOver: function () {
            this.players[0].animate(this.players[0].health > 0 ? 'victory': 'death', this.players[0].health > 0);
            this.players[1].animate(this.players[1].health > 0 ? 'victory': 'death', this.players[1].health > 0);
            this.changeState(WAIT_RESET_STATE);

            this.replayButton.visible = true;
            this.replayButton.bringToTop();
        },

        replayButtonOnClick: function () {
            this.game.sound.stopAll();
            this.game.state.remove('Game');
            this.game.state.start('Menu');
        },

        changePlayer: function () {
            this.currentPlayer = 1 - this.currentPlayer;
            console.log('Player now playing: ' + this.currentPlayer);

            this.playerTurnStatus.text = this.players[this.currentPlayer].name + '\'s turn';

            if (this.currentPlayer == 0) {
                this.tokenPlayer1.visible = true;
                this.tokenPlayer2.visible = false;
            }
            else {
                this.tokenPlayer1.visible = false;
                this.tokenPlayer2.visible = true;

            }
        },

        changeState: function (state) {
            var oldState = this.gameState;

            if (state === PLAYER_ACTION_STATE) {
                this.hookEnterPlayerAction();
            }
            if (state === COMBAT_RESOLVE_STATE) {
                this.hookEnterCombat();
            }
            if (oldState === COMBAT_ANIM_STATE) {
                this.hookLeaveCombat();
            }

            this.gameState = state;
            console.log('State: ' + oldState + ' -> ' + state);
        },

        hookEnterPlayerAction: function () {
            this.players[0].animate('idle');
            this.players[1].animate('idle');
        },

        hookEnterCombat: function () {
            this.filter = this.game.add.sprite(
                this.game.world.centerX,
                constants.stage.ARENA_HEIGHT + (810 / 2),
                'filter'
            );
            this.filter.anchor.set(.5, .5);
            this.filter.alpha = .5;
        },

        hookLeaveCombat: function () {
            this.filter.destroy();
            this.filter = null;
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

            if (line != -1) {
                var newSprite = this.createCoin(
                    this.currentCoin,
                    column,
                    line
                );
                this.actionIsDone = true;
            }
            this.game.sound.play('sliding');
        },

        getAllMatches: function() {
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
                            // 5 coin aligned
                            matchs.push(currentMatch.slice(0,3));
                            matchs.push(currentMatch.slice(2));
                        }
                        else if (tmp >= 3) {
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
                }
                else {
                    ++diagStartX;
                }
            }

            // right
            for (var j = 0; j < constants.game.GRID_HEIGHT; ++j) {
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
                            // 5 coin aligned
                            matchs.push(currentMatch.slice(0,3));
                            matchs.push(currentMatch.slice(2));
                        }
                        else if (tmpX >= 3) {
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
                            // 5 coin aligned
                            matchs.push(currentMatch.slice(0,3));
                            matchs.push(currentMatch.slice(2));
                        }
                        else if (tmp >= 3) {
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
                }
                else {
                    ++diagStartX;
                }
            }

            // upper
            for (var i = 0; i < constants.game.GRID_WIDTH; ++i) {
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
                            // 3 or 4 aligned
                            matchs.push(currentMatch);
                        }
                    }
                    cptY -= tmpY;
                }
            }

            return matchs;
        },

        createCoin: function(coinType, column, line) {
            var coinYStart = constants.stage.COIN_START_HEIGHT + constants.stage.CELL_SIZE/2;
            var coinXStart = (column + 1) * constants.stage.CELL_SIZE;
            var yDestination = constants.stage.HEIGHT - (constants.game.GRID_HEIGHT - line) * constants.stage.CELL_SIZE;

            var coin = this.game.add.sprite(coinXStart, coinYStart, coinType);
            //var coin = this.game.add.sprite(coinXStart, coinYStart, 'coin');
            coin.anchor.set(.5, .5);
            var coinTween = this.game.add.tween(coin);

            coinTween.to({ y: yDestination }, (yDestination - coinYStart) );
            coinTween.start();
            coinTween.onComplete.add(this.onCoinTweenFinished.bind(this));

            this.gridFront.bringToTop();

            // Add coin to the grid.
            this.grid[column][line].sprite = coin;
            this.grid[column][line].value = coinType;

            ++this.animating;
            return coin;
        },

        onCoinTweenFinished: function() {
            this.game.sound.play('hit');
            --this.animating;
        },

        onAnimationFinished: function () {
            --this.animating;

            // Hide all FX.
            for (var i = this.animOrder.length - 1; i >= 0; --i) {
                if (this.fx[this.animOrder[i]].anim.isFinished) {
                    this.fx[this.animOrder[i]].sprite.visible = false;
                }
            }
        },

        getColumn: function(xClickPos) {
            return Math.floor( (xClickPos - 45) / constants.stage.CELL_SIZE);
        },

        getLine: function (column) {
            var bottom = constants.game.GRID_HEIGHT -1;
            while (bottom >= 0 && this.grid[column][bottom].value != NO_COIN) {
                --bottom;
            }

            return bottom;
        },
    };

    return Game;
});
