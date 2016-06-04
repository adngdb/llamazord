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
    const COMBAT_STATE = 'COMBAT_STATE';
    const GAME_OVER_STATE = 'GAME_OVER_STATE';

    const NO_COIN = 'NO_COIN';

    var Game = function (game) {
        // grid format : [GRID_WIDTH][GRID_HEIGHT]
        this.grid = [];

        this.currentCoin = 'coin_sun';
        this.currentPlayer = 0;

        this.players = [];

        this.gameState = PLAYER_ACTION_STATE;
        this.actionIsDone = false;
        this.roundActionsCount = 0;
        this.playerUpgrades = [];
        this.animating = 0;

        // all coin images
        this.coinSelected = null;
        this.coinOver = null;
        this.coinSun = null;
        this.coinBird = null;
        this.coinLizard = null;
    };

    Game.prototype = {
        update: function () {
            // if (this.coinSun.input.pointerOver(this.game.mouse)) {
            //     console.log("OVER 1");
            //     this.coinOver.visible = true;
            //     this.coinOver.position.x = this.coinSun.position.x;
            // } else if (this.coinLizard.input.pointerOver(this.game.mouse)) {
            //     console.log("OVER 2");
            //     this.coinOver.visible = true;
            //     this.coinOver.position.x = this.coinLizard.position.x;
            // } else if (this.coinBird.input.pointerOver(this.game.mouse)) {
            //     console.log("OVER 3");
            //     this.coinOver.visible = true;
            //     this.coinOver.position.x = this.coinBird.position.x;
            // } else {
            //     console.log("OVER ELSE");
            //     this.coinOver.visible = false;
            // }

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
                case COMBAT_STATE:
                    this.handleCombat();
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
            var background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background');
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
                constants.stage.HEIGHT - (constants.stage.CELL_SIZE * (constants.game.GRID_HEIGHT + 1) / 2),
                'grid'
            );
            this.gridSprite.inputEnabled = true;
            this.gridSprite.anchor.set(0.5, 0.5);
            this.gridSprite.events.onInputUp.add(this.onClick,this);

            // Create coin choice sprites.
            function setCurrentCoin(coin, x) {
                return function () {
                    this.currentCoin = coin;
                    this.coinSelected.position.x = x;
                };
            }

            function createCoin(ctx, name, x) {
                var coin = ctx.game.add.sprite(
                    x,
                    ctx.game.world.centerY,
                    name
                );
                coin.anchor.set(0.5, 0.5);
                coin.inputEnabled = true;
                coin.events.onInputUp.add(setCurrentCoin(name, x), ctx);
                return coin;
            }

            // var coinSelected2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY-90, 'coin_selected');
            // coinSelected2.anchor.set(0.5, 0.5);

            this.coinSun = createCoin(this, 'coin_sun', this.game.world.centerX);
            this.coinBird = createCoin(this, 'coin_bird', this.game.world.centerX + constants.stage.CELL_SIZE);
            this.coinLizard = createCoin(this, 'coin_lizard', this.game.world.centerX - constants.stage.CELL_SIZE);
            this.coinSelected = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'coin_selected');
            this.coinSelected.anchor.set(0.5, 0.5);
            this.coinOver = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'coin_over');
            this.coinOver.anchor.set(0.5, 0.5);
            this.coinOver.visible = false;

            // create GUI
            this.createGUI();

            // create players
            this.players[0] = new Player(this.game, 0);
            this.players[1] = new Player(this.game, 1);

            // start audio
            this.game.sound.play('ambiance');

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
                        this.changeState(COMBAT_STATE);
                    }
                    else {
                        this.changePlayer();
                        this.changeState(PLAYER_ACTION_STATE);
                    }
                }
            }
        },

        handleUpgrade: function () {
            // Handle upgrades.
            var upgrade = this.playerUpgrades.pop();
            if (upgrade) {
                // Propose the next upgrade.
            }
            else {
                // All upgrades are done, go to the next state.
                if (this.roundActionsCount === 6) {
                    // Note that we do not change the current player. The
                    // player that plays last this round will play first
                    // next round.
                    this.changeState(COMBAT_STATE);
                }
                else {
                    this.changePlayer();
                    this.changeState(PLAYER_ACTION_STATE);
                }
            }
        },

        handleCombat: function () {
            this.changeState(PLAYER_ACTION_STATE);
        },

        handleGameOver: function () {
            // TODO
            console.log('Game Over');
        },

        changePlayer: function () {
            this.currentPlayer = 1 - this.currentPlayer;
            console.log('Player now playing: ' + this.currentPlayer);
        },

        changeState: function (state) {
            var oldState = this.gameState;
            this.gameState = state;
            console.log('State: ' + oldState + ' -> ' + state);
        },

        onClick: function() {
            if (this.animating != 0) {
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

            ++this.animating;
            return coin;
        },

        onCoinTweenFinished: function() {
            this.game.sound.play('hit');
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
