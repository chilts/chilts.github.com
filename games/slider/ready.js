$(function() {

    // zero is where the blank tile is
    var grid = [
        [  0,  1,  2,  3 ],
        [  4,  5,  6,  7 ],
        [  8,  9, 10, 11 ],
        [ 12, 13, 14, 15 ]
    ];

    var $tiles = $('.tile');

    function findId(id) {
        for ( var i = 0; i < 4; i++ ) {
            for ( var j = 0; j < 4; j++ ) {
                console.log(id, i, j, grid[j][i]);
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
        console.log('Checking if complete');
        var num = 0;
        for( var j = 0; j < 4; j++ ) {
            for( var i = 0; i < 4; i++ ) {
                console.log(i, j);
                if ( grid[j][i] !== num ) {
                    return false;
                }
                num++;
            }
        }

        // might be finished
        console.log("Well done, you've won");
    }

    function makeMove(pos, id) {
        var i = pos.i;
        var j = pos.j;

        console.log('Checking ' + i + ':' + j);

        // check above
        if ( j > 0 ) {
            console.log('above');
            if ( grid[j-1][i] === 15 ) {
                console.log('above wins');
                $($tiles[id]).animate(
                    { 'top' : '-=115' },
                    function() {
                        grid[j-1][i] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                    }
                );
                return;
            }
        }

        // check below
        if ( j < 3 ) {
            console.log('below');
            if ( grid[j+1][i] === 15 ) {
                console.log('below wins');
                $($tiles[id]).animate(
                    { 'top' : '+=115' },
                    function() {
                        grid[j+1][i] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                    }
                );
                return;
            }
        }

        // check left
        if ( i > 0 ) {
            console.log('left');
            if ( grid[j][i-1] === 15 ) {
                console.log('left wins');
                $($tiles[id]).animate(
                    { 'left' : '-=115' },
                    function() {
                        grid[j][i-1] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
                    }
                );
                return;
            }
        }

        // check right
        if ( i < 3 ) {
            console.log('right');
            if ( grid[j][i+1] === 15 ) {
                console.log('right wins');
                $($tiles[id]).animate(
                    { 'left' : '+=115' },
                    function() {
                        grid[j][i+1] = grid[j][i];
                        grid[j][i] = 15;
                        checkComplete();
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

        // figure out what number this tile is
        var $this = $(this);
        var id = $(this).attr('id');
        id = parseInt(id);

        console.log(id);

        var pos = findId(id);
        console.log(pos);

        // now make the tile move if it's ok
        makeMove(pos, id);
    });

});
