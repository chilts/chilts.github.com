$(function() {

    // zero is where the blank tile is
    var grid = [
        [  0,  1,  2,  3 ],
        [  4,  5,  6,  7 ],
        [  8,  9, 10, 11 ],
        [ 12, 13, 14, 15 ]
    ];

    var moving = false;
    var $tiles = $('.tile');

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

    function checkComplete() {
        var num = 0;
        for( var j = 0; j < 4; j++ ) {
            for( var i = 0; i < 4; i++ ) {
                if ( grid[j][i] !== num ) {
                    return false;
                }
                num++;
            }
        }

        // might be finished
        console.log("Well done, you've won!");
    }

    function makeMove(pos, id) {
        var i = pos.i;
        var j = pos.j;

        // check above
        if ( j > 0 ) {
            if ( grid[j-1][i] === 15 ) {
                moving = true;
                $($tiles[id]).animate(
                    { 'top' : '-=115' },
                    function() {
                        grid[j-1][i] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                        moving = false;
                    }
                );
                return;
            }
        }

        // check below
        if ( j < 3 ) {
            if ( grid[j+1][i] === 15 ) {
                moving = true;
                $($tiles[id]).animate(
                    { 'top' : '+=115' },
                    function() {
                        grid[j+1][i] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                        moving = false;
                    }
                );
                return;
            }
        }

        // check left
        if ( i > 0 ) {
            if ( grid[j][i-1] === 15 ) {
                moving = true;
                $($tiles[id]).animate(
                    { 'left' : '-=115' },
                    function() {
                        grid[j][i-1] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                        moving = false;
                    }
                );
                return;
            }
        }

        // check right
        if ( i < 3 ) {
            if ( grid[j][i+1] === 15 ) {
                moving = true;
                $($tiles[id]).animate(
                    { 'left' : '+=115' },
                    function() {
                        grid[j][i+1] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                        moving = false;
                    }
                );
                return;
            }
        }
        return false;
    }

    // for all of the tiles, add the background image
    var img = 'img/elephant.png';
    $('.tile').css({
        'background-image' : 'url(' + img + ')'
    });

    $('.tile').click(function(ev) {
        ev.preventDefault();
        if ( moving ) {
            return;
        }

        // figure out what number this tile is
        var $this = $(this);
        var id = $(this).attr('id');
        id = parseInt(id);

        var pos = findId(id);

        // now make the tile move if it's ok
        makeMove(pos, id);
    });

    // now, enable the user to change images
    $('.select').click(function(ev) {
        ev.preventDefault();

        var img = $(this).attr('src');
        $('.tile').css({
            'background-image' : 'url(' + img + ')'
        });
    });
});
