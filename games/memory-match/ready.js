var startIntroSequence;

$(function() {
    // ------------------------------------------------------------------------
    // constants

    var icons = [
        'alligator',
        'ant',
        'bat',
        'bear',
        'bee',
        'bird',
        'bulldog',
        'bull',
        'butterfly',
        'cat',
        'chicken',
        'cow',
        'crab',
        'crocodile',
        'deer',
        'dog',
        'donkey',
        'duck',
        'eagle',
        'elephant',
        'fish',
        'fox',
        'frog',
        'giraffe',
        'gorilla',
        'hippo',
        'horse',
        'insect',
        'lion',
        'monkey',
        'moose',
        'mouse',
        'owl',
        'panda',
        'penguin',
        'pig',
        'rabbit',
        'rhino',
        'rooster',
        'shark',
        'sheep',
        'snake',
        'tiger',
        'turkey',
        'turtle',
        'wolf'
    ];

    // ------------------------------------------------------------------------
    // set up some selectors

    var $start = $('#start');
    var $frontImgs = $('.front img');
    var $backImgs = $('.back img');
    var $cards = $('.card');
    var $fronts = $('.front');
    var $backs = $('.back');

    var endSequenceTimeout;
    var endSequenceInMotion;
    var introInterval;
    var deck;
    var $currentImg;
    var pairsFound;

    var resetAll = function() {
        if ( endSequenceTimeout ) {
            clearTimeout(endSequenceTimeout);
        }

        if ( introInterval ) {
            clearInterval(introInterval);
        }

        // reset all vars
        introInterval = undefined;
        endSequenceTimeout = undefined;
        endSequenceInMotion = false;
        deck = [];
        $currentImg = undefined;
        pairsFound = 0;

        // reset all the cards and images (to show the front of the cards)
        $cards.css({ 'rotate' : '0deg', 'rotateX' : '0deg', 'rotateY' : '0deg', 'scale' : 1.0 });
        $frontImgs.stop().css({ 'top' : 0 }).show();
        $frontImgs.parent().css({ 'rotate' : '0deg', 'scale' : 1.0 });
        $backImgs.parent().css({ 'rotate' : '0deg', 'scale' : 1.0 });

        // show the front of the cards
        $backs.addClass('hide').css({ 'rotate' : '0deg', 'scale' : 1.0 });
        $fronts.removeClass('hide').css({ 'rotate' : '0deg', 'scale' : 1.0 });
    };

    // ------------------------------------------------------------------------
    // intro animation

    startIntroSequence = function() {
        introInterval = setInterval(function() {
            var img = Math.floor(Math.random()*$frontImgs.size());
            var icon = Math.floor(Math.random()*icons.length);

            var $img = $($frontImgs[img]);
            var degrees = Math.random()*60 - 30;
            var spin = false, rotate = false;
            if ( degrees > -2 && degrees < 0 ) {
                spin = true;
            }
            if ( degrees > 0 && degrees < 2 ) {
                rotate = true;
            }
            var scale = Math.random()/2 + 1.25;
            $img
                .hide()
                .attr('src', 'i/' + icons[icon] + '.png')
                .fadeIn();
            if ( spin ) {
                // spin it
                $img.parent()
                    .transition({ 'rotate' : '+=180deg', 'scale' : scale })
                    .transition({ 'rotate' : '+=180deg', 'scale' : 1.0 });
            }
            else if ( rotate ) {
                // rotate it
                $img.parent()
                    .transition({ 'rotateYw' : '+=360deg', 'scale' : scale })
                    .transition({ 'rotateY' : '+=360deg', 'scale' : 1.0 });
            }
            else {
                // a normal rotation
                $img.parent()
                    .transition({ 'rotate' : '+=' + degrees + 'deg', 'scale' : scale })
                    .transition({ 'rotate' : '-=' + degrees + 'deg', 'scale' : 1.0 });
            }
        }, 750);
    };

    var bounceMe = function($img) {
        var jumpHeight = 30 + Math.round(Math.random()*15);
        var speed = 150 + Math.round(Math.random()*50);

        $img.animate({
            'top' : '-=' + jumpHeight + 'px'
        }, speed, 'easeOutCubic', function() {
            $img.animate({
                'top' : '+=' + jumpHeight + 'px'
            }, speed, 'easeInCubic', function() {
                if ( endSequenceInMotion ) {
                    bounceMe($img);
                }
            })
        });
    };

    var startEndSequence = function() {
        endSequenceInMotion = true;

        // reset the front images first
        $frontImgs.transition({ 'scale' : 1, 'opacity' : 1 });

        setTimeout(function() {
            for ( var i = 0; i < $frontImgs.size(); i++ ) {
                bounceMe( $($frontImgs[i]) );
            }

            // only show the end sequence for 10s
            endSequenceTimeout = setTimeout(function() {
                resetAll();
                startIntroSequence();
            }, 10000);
        }, 1000);
    };

    // ------------------------------------------------------------------------
    // playing the game

    var newGame = function() {
        // firstly, reset everything
        resetAll();

        // stopEndSequence();
        $fronts.addClass('hide');
        $backs.removeClass('hide');
        shuffleCards();
        dealOutCards();
    };

    var shuffleArray = function(a) {
        var rand, temp;
        for( var i = 0; i < a.length; i++ ) {
            rand = Math.floor(Math.random()*a.length);
            temp = a[rand];
            a[rand] = a[i];
            a[i] = temp;
        }
    }

    var shuffleCards = function() {
        var i;

        // firstly, get a list of 9 cards we want
        // shuffleIcons();
        shuffleArray(icons);

        // get the first 9 cards twice (to make up the pairs)
        deck = [];
        for ( i = 0; i < $frontImgs.size()/2; i++ ) {
            deck.push(icons[i]);
            deck.push(icons[i]);
        }

        // shuffle the cardImages
        shuffleArray(deck);
    };

    var dealOutCards = function() {
        $frontImgs.each(function(i, el) {
            el.src = 'i/' + deck[i] + '.png';
        });
    };

    // ------------------------------------------------------------------------
    // event handlers

    $start.click(function() {
        // reset everything
        resetAll();

        // randomise cards (not sure why we do this on nextTick())
        setTimeout(newGame, 0);
    });

    $backs.click(function() {
        var $back = $(this);
        var $front = $(this).prev();
        var $img = $front.find('img');
        $back
            .transition({ 'rotateY' : '+=90deg', 'scale' : 2 }, 250, 'linear', function() {
                $back.addClass('hide');
                $front.removeClass('hide');
                $front
                    .css({ 'rotateY' : '+=90deg', 'scale' : 2 })
                    .transition({ 'rotateY' : '-=90deg', 'scale' : 1.0 }, 250, 'linear', function() {
                        // okay, we've turned over the card, now check if we have a pair
                        if ( $currentImg ) {
                            if ( $img.attr('src') === $currentImg.attr('src') ) {
                                var toFade = [ $img, $currentImg ];
                                $currentImg = undefined;
                                pairsFound++;

                                // fade both of these in a short while
                                setTimeout(function() {
                                    toFade[0].transition({ 'scale' : 2, 'opacity' : 0 });
                                    toFade[1].transition({ 'scale' : 2, 'opacity' : 0 });

                                    // if we have all of the pairs, go into the endSequence()
                                    if ( pairsFound === $frontImgs.size()/2 ) {
                                        startEndSequence();
                                    }
                                }, 1000);
                            }
                            else {
                                // turn them both over in a few seconds
                                var toTurnBack = [ $img, $currentImg ];
                                $currentImg = undefined;
                                setTimeout(function() {
                                    toTurnBack[0].parent().addClass('hide').next().css({ 'scale' : 1, 'rotateY' : '0deg' }).removeClass('hide');
                                    toTurnBack[1].parent().addClass('hide').next().css({ 'scale' : 1, 'rotateY' : '0deg' }).removeClass('hide');
                                }, 1000);
                            }
                        }
                        else {
                            $currentImg = $img;
                        }
                    });
            });
    });

    // ------------------------------------------------------------------------
    // initial setup

    // start the random showing of the cards
    resetAll();

    // ------------------------------------------------------------------------
});

$(window).load(function () {
    startIntroSequence();
});
