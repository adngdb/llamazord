define([
    'constants',
    'classes/Player',
],
function (constants, Player) {
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
        this.currentplayer = 0;
        this.players = [];

        this.gameState = PLAYER_ACTION_STATE;
        this.actionIsDone = false;
        this.roundActionsCount = 0;
        this.playerUpgrades = [];
    };

    Game.prototype = {
        update: function () {
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
            this.game.load.image('background', 'assets/back_green.png');
            this.game.load.image('grid', 'assets/grid.png');
            this.game.load.image('coin_sun', 'assets/jeton-soleil.png');
            this.game.load.image('coin_bird', 'assets/jeton-oiseau.png');
            this.game.load.image('coin_lizard', 'assets/jeton-lezard.png');

            // load audio
            this.game.load.audio('ambiance', 'assets/sfx/ambience.ogg');
            this.game.load.audio('ambiance_2', 'assets/sfx/ambience.ogg');

            // Init grid structure.
            for (var i = 0; i < constants.game.GRID_WIDTH; ++i) {
                this.grid[i] = [];
                for (var j = 0; j < constants.game.GRID_HEIGHT; ++j) {
                    this.grid[i][j] = NO_COIN;
                }
            }
        },

        create: function () {
            // set background sprite
            var background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background');
            background.anchor.set(0.5, 0.5);

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
            function setCurrentCoin(coin) {
                return function () {
                    this.currentCoin = coin;
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
                coin.events.onInputUp.add(setCurrentCoin(name), ctx);
            }

            createCoin(this, 'coin_sun', this.game.world.centerX);
            createCoin(this, 'coin_bird', this.game.world.centerX + constants.stage.CELL_SIZE);
            createCoin(this, 'coin_lizard', this.game.world.centerX - constants.stage.CELL_SIZE);

            // create GUI
            this.createGUI();
            this.createGrid();

            // create players
            this.players[0] = new Player();

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
            var matches = this.computeGrid();

            if (matches.length) {
                // Stack player upgrades.
                this.playerUpgrades.push(1);
                // Remove the matches.
                // Animate the falling pieces.
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
            var xClickPos = this.input.activePointer.x;

            var column = this.getColumn(xClickPos);
            console.log (column);
            if (column < 0 || column >= constants.game.GRID_WIDTH) {
                return;
            }
            var line = this.getLine(column);

            if (line == -1) {
                // No space in column
                this.invalidColumn();
            } else {
                // create coin
                this.grid[column][line] = this.currentCoin;
                // console.log("set coin in : " + column +" "+ line);
                // TODO: set the "right" coin type
                this.createCoin(
                    column,
                    constants.stage.HEIGHT - (constants.game.GRID_HEIGHT - line) * constants.stage.CELL_SIZE
                );
                this.actionIsDone = true;
            }
        },

        createGUI: function () {
        },

        // Used for debugging. Might be deleted later?
        createGrid: function () {
            var offsetX = 90 / 2;
            var offsetY = 90 / 2 + (1280 - 90 * 6);

            for (var i = 0; i < constants.game.GRID_WIDTH; i++) {
                for (var j = 0; j < constants.game.GRID_HEIGHT; j++) {
                    var rect = new Phaser.Rectangle(offsetX + i * 90, offsetY + j * 90, 90, 90);
                    this.game.debug.geom(rect, 'rgba(200,0,0,0.5)');
                }
            }
        },

        computeGrid: function() {
            // search for "matchs"
            var matches = this.getAllMatchs();
            console.log(matches.length + " found :");
            for (var i=0; i<matches.length; ++i) {
                console.log("\t" + matches[i]);
            }
            return matches;
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
                    if (currentCell != NO_COIN) {
                        var currentMatch = [[currX,currY]];
                        while (currX+tmp < constants.game.GRID_WIDTH
                            && currY+tmp >= 0
                            && currentCell == this.grid[currX+tmp][currY+tmp]) {
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
                    if (currentCell != NO_COIN) {
                        var currentMatch = [[cptX,j]];
                        while (cptX+tmpX< constants.game.GRID_WIDTH && currentCell == this.grid[cptX+tmpX][j]) {
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
                    if (currentCell != NO_COIN) {
                        var currentMatch = [[currX,currY]];
                        while (currX+tmp < constants.game.GRID_WIDTH
                            && currY-tmp >= 0
                            && currentCell == this.grid[currX+tmp][currY-tmp]) {
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
                var cptY = constants.game.GRID_WIDTH-1;
                while(cptY >2) {
                    var currentCell = this.grid[i][cptY];
                    var tmpY = 1;
                    if (currentCell != NO_COIN) {
                        var currentMatch = [[i,cptY]];
                        while (cptY-tmpY >= 0 && currentCell == this.grid[i][cptY-tmpY]) {
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

            coinTween.to({ y: ydestination }, (ydestination - coinYStart) * 2 );
            coinTween.start();
        },

        invalidColumn: function() {
            console.log("TODO : No place in column");
        },

        getColumn: function(xClickPos) {
            return Math.floor( (xClickPos - 45) / constants.stage.CELL_SIZE);
        },

        getLine: function (column) {
            var bottom = constants.game.GRID_HEIGHT -1;
            while (this.grid[column][bottom] != NO_COIN) {
                --bottom;
            }

            return bottom;
        }

    };

    return Game;
});
