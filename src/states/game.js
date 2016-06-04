define([
    'constants',
    'classes/Player',
],
function (constants, Player) {
    var Game = function (game) {
        // grid format : [GRID_WIDTH][GRID_HEIGHT]
        this.grid = [];

        this.currentplayer = 0;
        this.players = [];
    };

    Game.prototype = {
        init: function () {
        },

        update: function () {

       },

        preload: function() {

            this.game.load.image('background', 'assets/back_green.png');
            this.game.load.image('grid', 'assets/grid.png');
            this.game.load.image('player', 'assets/player_blue.png');
            this.game.load.image('coin', 'assets/coin.png');


            for(var i=0; i<constants.game.GRID_WIDTH; ++i) {
                this.grid[i] = [];
                for(var j=0; j<constants.game.GRID_HEIGHT; ++j) {
                    this.grid[i][j] = constants.coin.NO_COIN;
                }
            }
        },

		onClick : function(){
			console.log("prout");
			this.fire();
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

            // set player sprite
            var player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
            player.anchor.set(0.5, 0.5);
            // create GUI
            this.createGUI();
            this.createGrid();

            // create players
            this.players[0] = new Player();

            this.click(240);
            this.click(240);
            this.click(240);
            this.click(240);
            this.click(240);
            this.click(60);
            this.click(150);
            this.click(330);
            this.click(420);
            this.click(600);
            this.grid[3][2] = 1;
            this.grid[4][1] = 1;
            this.grid[5][0] = 1;
            this.grid[1][2] = 1;
            // manage inputs
            this.computeInput();
        },

        click: function(xClickPos) {
            var column = this.getColumn(xClickPos);
            var line = this.getLine(column);
            if (line == -1) {
                // No space in column
                this.invalidColumn();
            } else {
                // create coin
                this.grid[column][line] = 1;
                // console.log("set coin in : " + column +" "+ line);
                // TODO: set the "right" coin type
                this.createCoin(column, constants.stage.HEIGHT - (constants.game.GRID_HEIGHT - line) * constants.stage.CELL_SIZE);
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

        computeInput: function() {

            // manage grid (if inputs)
            this.computeGrid();

            // switch player (if inputs)
            this.currentplayer = 1 - this.currentplayer;
        },

        computeGrid:function() {
            // search for "matchs"
            var matchs = this.getAllMatchs();
console.log(matchs.length + " found :");
for (var i=0; i<matchs.length; ++i) {
    console.log("\t" + matchs[i]);
}
            // if (matchs.length != 0) {
            //     this.removeMatchs();
            //     this.computeGrid();
            // }
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
                    if (currentCell != constants.coin.NO_COIN) {
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
                    if (currentCell != constants.coin.NO_COIN) {
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
                    if (currentCell != constants.coin.NO_COIN) {
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
                    if (currentCell != constants.coin.NO_COIN) {
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

            var coin = this.game.add.sprite(coinXStart, coinYStart, 'coin');
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
		fire: function(){
			console.log("bonjour");
		var a= this.input.activePointer.x;
		console.log('X:' + this.input.activePointer.x);
			this.click(a);
		},


        getLine: function (column) {
            var bottom = constants.game.GRID_HEIGHT -1;
            while (this.grid[column][bottom] != constants.coin.NO_COIN) {
                --bottom;
            }

            return bottom;
        }

    };

    return Game;
});
