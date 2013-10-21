var nicam = nicam || {};

nicam.ki = (function ($) {
    var probability, probCtx;
    var state, stateCtx;

    var x = 10;
    var y = 10;
    var fieldsize = 50;

    var xOffset = 0;
    var yOffset = 0;
    var ships = [2,3,4,5];
    // var ships = [5,2,3];

    var field = [];
    var state = [];

    var init = function () {
        probability = document.getElementById('probability');
        state = document.getElementById('state');
        probCtx = probability.getContext("2d");
        stateCtx = state.getContext("2d");

        // states:
        // 0 is unknown
        // 1 is miss
        // 2 is hit

        reset(state);

        calculate();
        draw();
        bind();
    };

    var reset = function (dataset) {
        dataset = dataset || field;
        for (var i = 0; i<x; i++) {
            dataset[i] = [];
            for (var j = 0; j<y; j++) {
                dataset[i][j] = 0;
            }
        }
    };

    var bind = function () {
        $('#state').on('click', markField);
    };

    var markField = function (e) {
        var position = $(state).offset();
        xOffset = position.left;
        yOffset = position.top;

        var posX = parseInt((e.pageX - xOffset)/fieldsize, 10);
        var posY = parseInt((e.pageY - yOffset)/fieldsize, 10);

        state[posX][posY]++;
        state[posX][posY] = state[posX][posY] %3;
        draw();
    };

    var calculate = function () {
        reset();
        // check ships vertical
        for (var j = 0; j<y; j++) {// go down
            for (var i = 0; i<x; i++) { // move right
                for (var s = 0; s < ships.length; s++) {
                    var fits = true;
                    var hits = 0;
                    for (c = 0; c<ships[s]; c++) {
                        if (typeof state[i][j+c] === 'undefined' || state[i][j+c] === 1) {
                            fits = false;
                            break;
                        }
                        if (state[i][j+c] === 2) {
                            hits = hits + 1;
                        }
                    }
                    if (fits) {
                        for (c = 0; c<ships[s]; c++) {
                            if (state[i][j+c] === 0) {
                                field[i][j+c] = field[i][j+c] + 5 + hits*30;
                            }
                        }
                    }
                }
            }
        }

        // check ships horizontal
        for (var j = 0; j<y; j++) {// go down
            for (var i = 0; i<x; i++) { // move right
                for (var s = 0; s < ships.length; s++) {
                    var fits = true;
                    var hits = 0;
                    for (c = 0; c<ships[s]; c++) {
                        if (typeof state[i+c] === 'undefined' || typeof state[i+c][j] === 'undefined' || state[i+c][j] === 1) {
                            fits = false;
                            break;
                        }
                        if (state[i+c][j] === 2) {
                            hits = hits + 1;
                        }
                    }
                    if (fits) {
                        for (c = 0; c<ships[s]; c++) {
                            if (state[i+c][j] === 0) {
                                field[i+c][j] = field[i+c][j] + 5 + hits*5;
                            }
                        }
                    }
                }
            }
        }
    };

    var draw = function () {
        var prob = 0;
        var hit = {};

        calculate();
        clear();

        for (var i = 0; i<x; i++) {
            for (var j = 0; j<y; j++) {
                if (field[i][j] > prob) {
                    hit = {x: i, y: j, probability: field[i][j]};
                    prob = field[i][j];
                }

                if (state[i][j] === 0) {
                    stateCtx.fillStyle = 'rgb(0,0,255)';
                } else if (state[i][j] === 1) {
                    stateCtx.fillStyle = 'rgb(0,0,100)';
                } else if (state[i][j] === 2) {
                    stateCtx.fillStyle = 'rgb(0,255,0)';
                } 
                stateCtx.fillRect(i*50,j*50,49,49);
            }
        }

        var factor = (255/prob);
        for (var i = 0; i<x; i++) {
            for (var j = 0; j<y; j++) {
                if (field[i][j] === field[hit.x][hit.y]) {
                    probCtx.fillStyle = 'rgb(255,0,0)';
                } else {
                    var value = parseInt(factor*field[i][j]);
                    probCtx.fillStyle = 'rgb('+(255-value)+','+(255-value)+','+(255-value)+')';
                }
                probCtx.fillRect(i*50,j*50,49,49);
            }
        }

        probCtx.stroke();
        stateCtx.stroke();
    };

    var clear = function () {
        probCtx.clearRect(0, 0, 500, 500);
        stateCtx.clearRect(0, 0, 500, 500);
    };

    return {
        init: init
    };
})(jQuery);

jQuery(function($) {
    nicam.ki.init();
});


