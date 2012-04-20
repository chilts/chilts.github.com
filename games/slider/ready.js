// From: http://blog.mastykarz.nl/jquery-random-filter/
jQuery.jQueryRandom = 0;
jQuery.extend(jQuery.expr[":"], {
    random: function(a, i, m, r) {
        if (i == 0) {
            jQuery.jQueryRandom = Math.floor(Math.random() * r.length);
        };
        return i == jQuery.jQueryRandom;
    }
});

$(function() {

    // zero is where the blank tile is
    var grid = [
        [  0,  1,  2,  3 ],
        [  4,  5,  6,  7 ],
        [  8,  9, 10, 11 ],
        [ 12, 13, 14, 15 ]
    ];

    var mode = '';
    var $board = $('#board');
    var $tiles = $('.tile');
    var tilesize = 115;
    var $roundabout = $('#roundabout');
    var $cars = $('.car');

    // ---
    // general purpose functions

    function visitAllTiles(fn) {
        for ( var j = 0; j < 4; j++ ) {
            for ( var i = 0; i < 4; i++ ) {
                fn(j, i, grid[j][i]);
            }
        }
    }

    function findId(id) {
        for ( var i = 0; i < 4; i++ ) {
            for ( var j = 0; j < 4; j++ ) {
                if ( grid[j][i] === id ) {
                    return { 'i' : i, 'j' : j };
                }
            }
        }
        return false;
    }

    function findBlank() {
        return findId(0);
    }

    function randomTilePos() {
        var pos = {};
        pos.i = Math.floor(Math.random() * 4);
        pos.j = Math.floor(Math.random() * 4);
        return pos;
    }

    function randomiseTiles() {
        var tmp, pos;
        mode = 'randomising';
        if ( false ) {
            visitAllTiles(function(j, i, id) {
                // get a random tile
                pos = randomTilePos();

                // switch it with this position
                grid[j][i] = grid[pos.j][pos.i];
                grid[pos.j][pos.i] = id;

                // put these two tiles into the right position on the board
                $($tiles[grid[j][i]]).animate({
                    'top'  : ( j * tilesize ) + 'px',
                    'left' : ( i * tilesize ) + 'px',
                });
                $($tiles[grid[pos.j][pos.i]]).animate({
                    'top'  : ( pos.j * tilesize ) + 'px',
                    'left' : ( pos.i * tilesize ) + 'px',
                });
            });
        }

        // for 100 times (waiting for the animation each time)
        var loop = 0;
        function moveAgain() {
            if ( loop < 200 ) {
                var id = chooseTileToMove();
                makeMove(id, 1, moveAgain);
                loop++;
            }
            else {
                mode = 'play';
            }
        }
        // set the randomise thing off
        moveAgain();
    }

    function checkComplete() {
        // only check if we have won if we're in play mode
        if ( mode !== 'play' ) {
            return;
        }

        var num = 0;
        for( var j = 0; j < 4; j++ ) {
            for( var i = 0; i < 4; i++ ) {
                if ( grid[j][i] !== num ) {
                    return false;
                }
                num++;
            }
        }

        // the person has won
        setMode('end');
    }

    // ---

    var introSequence;
    var tileMoving = false; // used when in play
    var endSequence;

    function setMode(newMode) {
        // only do this if the mode changes
        if ( mode === newMode ) {
            return;
        }

        // set the new mode
        mode = newMode;

        // stop all of the previous modes

        // * intro
        clearInterval(introSequence);

        // * play
        tileMoving = false;
        $tiles.stop(true, true);

        // * end
        $cars.fadeOut();
        clearTimeout(endSequence);

        if ( mode === 'intro' ) {
            introSequence = setInterval(randomMove, 250);
            $roundabout.fadeOut(function() {
                $board.fadeIn();
            });
        }
        if ( mode === 'play' ) {
            // randomise the board
            randomiseTiles();
            $roundabout.fadeOut(function() {
                $board.fadeIn();
            });
        }
        if ( mode === 'end' ) {
            // make the board disappear
            $board.fadeOut(function() {
                $roundabout.fadeIn();
                // randomise the tile image for the next time
                randomImage();
            });

            function animateCar($el) {
                if ( mode !== 'end' ) {
                    return;
                }

                $el.animate({
                    'left' : [ 0, 'easeOutSine' ],
                    'top' : [ 200, 'easeInSine' ]
                }, 1000).animate({
                    'left' : [ 200, 'easeInSine' ],
                    'top' : [ 400, 'easeOutSine' ]
                }, 1000).animate({
                    'left' : [ 400, 'easeOutSine' ],
                    'top' : [ 200, 'easeInSine' ]
                }, 1000).animate({
                    'left' : [ 200, 'easeInSine' ],
                    'top' : [ 0, 'easeOutSine' ]
                }, 1000, function() {
                    animateCar($el);
                });
            }

            // hide the cars, then make the appear progressively
            $cars.hide();
            $cars.each(function(i, el) {
                var $el = $(el);
                $el.css({
                    'left' : 200, 'top' : 0
                });
                setTimeout(function() {
                    $el.fadeIn(function() {
                        animateCar($el);
                    });
                }, 4000 / $cars.size() * i);
            });

            // only show the end sequence for 10ss, then switch to the intro again
            endSequence = setTimeout(function() {
                setMode('intro');
            }, 10000);
        }
    }

    // ---
    // intro mode

    function chooseDirection() {
        // do 50:50 for 'x' and 'y'
        return ( Math.random() > 0.5 ? 'x' : 'y' );
    }

    function chooseFlipFlop() {
        return ( Math.random() > 0.5 ? 1 : -1 );
    }

    // returns a tile id which is next to the blank tile
    function chooseTileToMove() {
        var pos = findId(15);

        // choose which direction to fill
        if ( chooseDirection() === 'x' ) {
            if ( pos.i === 0 ) {
                // must move the right tile to the left
                id = grid[pos.j][pos.i+1];
            }
            else if ( pos.i === 3 ) {
                // must move the left tile to the right
                id = grid[pos.j][pos.i-1];
            }
            else {
                // choose which direction
                var flipflop = chooseFlipFlop();
                id = grid[pos.j][pos.i+flipflop];
            }
        }
        else {
            if ( pos.j === 0 ) {
                // must move the right tile to the left
                id = grid[pos.j+1][pos.i];
            }
            else if ( pos.j === 3 ) {
                // must move the left tile to the right
                id = grid[pos.j-1][pos.i];
            }
            else {
                // choose which direction
                var flipflop = chooseFlipFlop();
                id = grid[pos.j+flipflop][pos.i];
            }
        }
        return id;
    }

    function randomMove() {
        // only do this if we're in the intro
        if ( mode !== 'intro' ) {
            // ToDo: we could cancel the interval here (which we'd have to restart at the relevant time
            return;
        }

        var id = chooseTileToMove();

        // now move the chosen tile
        $($tiles[id]).click();
    }

    function makeMove(id, duration, cb) {
        var pos = findId(id);
        var i = pos.i;
        var j = pos.j;
        duration = duration || 150;
        cb = cb || function(){};

        // check above
        if ( j > 0 ) {
            if ( grid[j-1][i] === 15 ) {
                tileMoving = true;
                $($tiles[id]).animate(
                    { 'top' : '-=115' },
                    duration,
                    function() {
                        grid[j-1][i] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                        tileMoving = false;
                        cb();
                    }
                );
                return;
            }
        }

        // check below
        if ( j < 3 ) {
            if ( grid[j+1][i] === 15 ) {
                tileMoving = true;
                $($tiles[id]).animate(
                    { 'top' : '+=115' },
                    duration,
                    function() {
                        grid[j+1][i] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                        tileMoving = false;
                        cb();
                    }
                );
                return;
            }
        }

        // check left
        if ( i > 0 ) {
            if ( grid[j][i-1] === 15 ) {
                tileMoving = true;
                $($tiles[id]).animate(
                    { 'left' : '-=115' },
                    duration,
                    function() {
                        grid[j][i-1] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                        tileMoving = false;
                        cb();
                    }
                );
                return;
            }
        }

        // check right
        if ( i < 3 ) {
            if ( grid[j][i+1] === 15 ) {
                tileMoving = true;
                $($tiles[id]).animate(
                    { 'left' : '+=115' },
                    duration,
                    function() {
                        grid[j][i+1] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                        tileMoving = false;
                        cb();
                    }
                );
                return;
            }
        }
        return false;
    }

    // for all of the tiles, add the background image
    function randomImage() {
        $('.tile').css({
            'background-image' : 'url(' + $('.select:random').attr('src') + ')'
        });
    }
    randomImage();

    $('.tile').click(function(ev) {
        ev.preventDefault();

        // only move if a tile isn't already moving
        if ( tileMoving ) {
            return;
        }

        // figure out what number this tile is
        var $this = $(this);
        var id = $this.attr('id');
        id = parseInt(id);

        // now make the tile move if it's ok
        makeMove(id);
    });

    $('#shuffle').click(function(ev) {
        ev.preventDefault();
        if ( mode === 'play' ) {
            // just re-arrange the tiles
            randomiseTiles();
        }
        else {
            // set the mode so we go through all the steps
            setMode('play');
        }
    });

    // now, enable the user to change images
    $('.select').click(function(ev) {
        ev.preventDefault();

        var img = $(this).attr('src');
        $('.tile').css({
            'background-image' : 'url(' + img + ')'
        });
    });

    // finally, set the intro mode
    setMode('intro');
});
