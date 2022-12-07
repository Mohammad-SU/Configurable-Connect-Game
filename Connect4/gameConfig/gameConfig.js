$("#configCollapser").click(function() {
    if ($("#configContent").css("width") == "350px") {
        $("#configContent").css({"width": "0px"})
        $("#configCollapser").css({"marginRight": "0px"})
        $(".configArrow.topArrow").removeClass("rotateLeftOp")
        $(".configArrow.bottomArrow").removeClass("rotateRightOp")
    }
    else {
        $("#configContent").css({"width": "350px"})
        $("#configCollapser").css({"marginRight": "350px"})
        $(".configArrow.topArrow").addClass("rotateLeftOp")
        $(".configArrow.bottomArrow").addClass("rotateRightOp")
    }
})

// Audio from ZapSplat.com
var pieceSFX_1 = new Audio("sounds/pieceSFX.mp3");
var pieceSFX_2 = new Audio("sounds/pieceSFX.mp3");
var swapSFX = new Audio("sounds/swapSFX.mp3");
var winnerSFX = new Audio("sounds/winnerSFX.mp3");
var audios = [];
audios.push(pieceSFX_1, pieceSFX_2, swapSFX, winnerSFX);
function changeVolume(volume) {audios.forEach(audioElement => audioElement.volume = volume)};
changeVolume(0.1);

$("#soundIcon").click(function() {
    if ($(this).hasClass("fa-volume-high")) {
        $(this).removeClass("fa-volume-high");
        $(this).addClass("fa-volume-xmark");
        changeVolume(0);
    }
    else {
        $(this).removeClass("fa-volume-xmark");
        $(this).addClass("fa-volume-high");
        changeVolume(0.1);
    }
})

var blitzStart = false;
var playerTime;

function mainReset() { // Avoid multiple "setInterval" instances when changing sliders.
    if (blitzEnabled) {
        if (updateCountdown_running) {
            clearInterval(playerTime)
            updateCountdown_running = false;
        }
        countdown_1.innerHTML = startMin + ":00";
        countdown_2.innerHTML = startMin + ":00";
        blitzStart = true;
        winner.innerText = "";
        board_html.remove();
        $(".countdown").removeClass("blinkCountdown");
        $("#winner").removeClass("animateText");
        setGame();
        gameEnd();
    }
    else {resetGame();}
}

let sizeSlider = document.getElementById("sizeSlider");
var tileSize = 80;
var tileFullSize = 90;  // Including margins
var tileMargins = 5;
var tileSize = tileFullSize - (tileMargins * 2);
var tileBorderWidth = 5;

sizeSlider.oninput = function() {
    switch (sizeSlider.value) {
        case "1": // 20 slots
            rows = 4;
            columns = 5
            tileFullSize = 130;
            tileMargins = 8;
            tileBorderWidth = 7;
            break;
        case "2": // 30
            rows = 5;
            columns = 6;
            tileFullSize = 105;
            tileMargins = 6;
            tileBorderWidth = 6;
            break;
        case "3": // 42 (classic)
            rows = 6;
            columns = 7;
            tileFullSize = 90;
            tileMargins = 5;
            tileBorderWidth = 5;
            break;
        case "4": // 56
            rows = 7;
            columns = 8;
            tileFullSize = 80;
            tileMargins = 4;
            tileBorderWidth = 5;
            break;
        case "5": // 72
            rows = 8;
            columns = 9;
            tileFullSize = 70;
            tileMargins = 4;
            tileBorderWidth = 5;
            break;
        case "6": // 90
            rows = 9;
            columns = 10;
            tileFullSize = 62;
            tileMargins = 3;
            tileBorderWidth = 5;
            break;
        case "7": // 110
            rows = 10;
            columns = 11;
            tileFullSize = 56;
            tileMargins = 3;
            tileBorderWidth = 4;
            break;
        case "8": // 132
            rows = 11;
            columns = 12;
            tileFullSize = 51;
            tileMargins = 3;
            tileBorderWidth = 4;
            break;
        case "9": // 156
            rows = 12;
            columns = 13;   
            tileFullSize = 47;   
            tileMargins = 2;
            tileBorderWidth = 4;
            break;
    }
    tileSize = tileFullSize - (tileMargins * 2);

    mainReset();
}

var connectSlider = document.getElementById("connectSlider");
var connectNum = parseInt(connectSlider.value);
var connectNeg = connectNum - 1; // "connectNeg" = connecteSlider.value "negated" by one, used in Connect4.js for "checkWinner()"

connectSlider.oninput = function() {
    connectNum = parseInt(connectSlider.value);
    connectNeg = connectNum - 1;
    document.title = ("Connect " + connectNum);
    document.getElementById("connectHeaderLast").innerText = ("ect " + connectNum);
    
    mainReset();
}

let blitzSlider = document.getElementById("blitzSlider");
let countdown_1 = document.getElementById("countdown_1");
let countdown_2 = document.getElementById("countdown_2");
var blitzEnabled = false;
var updateCountdown_running = false;
var startMin = 0;

blitzSlider.oninput = function(){
    switch (blitzSlider.value) {
        case "1":
            startMin = 0;
            clearInterval(playerTime)
            $(".clockIcon").css({display: "none"});
            countdown_1.innerHTML = "";
            countdown_2.innerHTML = "";
            blitzEnabled = false;
            break;
        case "2":
            startMin = 1;
            break;
        case "3":
            startMin = 2;
            break;
        case "4":
            startMin = 3;
            break;
        case "5":
            startMin = 4;
            break;
        case "6":
            startMin = 5;
            break; 
    }
    if (startMin > 0) {
        blitzEnabled = true;
        mainReset();
    } 
    else {resetGame()};
}

let doublesSlider = document.getElementById("doublesSlider");
var doublesColumn = false;
var doublesRow = false;
var doublesAny = false;
var doublesAnyRound_p1 = 0;
var doublesAnyRound_p2 = 0;

doublesSlider.oninput = function() {
    switch (doublesSlider.value) {
        case "1": // None
            doublesColumn = false;
            doublesRow = false;
            doublesAny = false;
            break;
        case "2": // Doubles Column
            doublesColumn = true;
            doublesRow = false;
            doublesAny = false;
            break; 
        case "3": // Doubles Row
            doublesColumn = false;
            doublesRow = true;
            doublesAny = false;
            break; 
        case "4": // Doubles Any
            doublesColumn = false;
            doublesRow = false;
            doublesAny = true;
            break; 
    }
    mainReset();
}

let swapSlider = document.getElementById("swapSlider")
var swapEnabled = false;
var rounds = 1;
var swapRound = 0;

swapSlider.oninput = function() {
    switch (swapSlider.value) {
        case "1":
            swapRound = 0;
            break;
        case "2":
            swapRound = 3;
            break; 
        case "3":
            swapRound = 5;
            break; 
        case "4":
            swapRound = 7;
            break;
        case "5":
            swapRound = 9;
            break;
        case "6":
            swapRound = 11;
            break;
        case "7":
            swapRound = 13;
            break;
        case "8":
            swapRound = 15;
            break; 
    }
    swapRound > 0 ? swapEnabled = true : swapEnabled = false;
    mainReset();
}