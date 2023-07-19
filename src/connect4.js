var board;
const player_1 = "p1"; // Used for updating board array
const player_2 = "p2";
var currPlayer = player_1;
var rows = 6;
var columns = 7;
var currColumns;
var currColumnsSize = [5, 5, 5, 5, 5, 5, 5];
var gameOver = false;
var dropRunning = false;
const winner = document.getElementById("winner");
const root = document.querySelector(":root");
const textShadowVal = "-0.5px -0.5px 0 navy, 0 -0.5px 0 navy, 0.5px -0.5px 0 navy, 0.5px 0 0 navy, 0.5px 0.5px 0 navy, 0 0.5px 0 navy, -0.5px 0.5px 0 navy, -0.5px 0 0 navy"

function changePlayerColourNumText() {
    if (currPlayer == player_1) {
        $("#playerColourNum_1").css({color: colour_1, textShadow: textShadowVal})
        $("#playerColourNum_2").css({color: "black", textShadow: "none"})
    }
    else {
        $("#playerColourNum_1").css({color: "black", textShadow: "none"})
        $("#playerColourNum_2").css({color: colour_2, textShadow: textShadowVal})
    }
}

setGame();
function setGame() {
    let board_html = document.createElement("div");
    board_html.id = "board_html";
    document.getElementById("gameCont_1").append(board_html);
    board = [];
    currColumns = currColumnsSize;
    if (swapEnabled) {
        rounds = 1;
        $("#winner").addClass("animate_1");
        winner.innerText = ("Swap in: " + swapRound + " rounds");
    };

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");
            // append HTML elements (row * column) number of times:
            // <div id="0-0" class="tile"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            board_html.append(tile);
        }
        board.push(row);
    }
    function hoverTileSet(hoverContainer, hoverTileID) {
        let hoverTile = document.createElement("div");
        hoverTile.id = hoverTileID;
        hoverTile.classList.add("hoverTile");
        hoverContainer.append(hoverTile);
    }
    for (let c = 0; c < columns; c++) {
        hoverTileSet(hoverCont_1, c)
        if (doublesColumn) {hoverTileSet(hoverCont_DC, c+"-"+"DC")}
    }

    $("#board_html").css({"width": tileFullSize * columns + 0+"rem", "height": tileFullSize * rows+"rem"});
    $(".tile").css({"width": tileSize+"rem", "height": tileSize+"rem", "margin": tileMargins+"rem", "borderWidth": tileBorderWidth+"rem", "boxShadow": "inset 0rem 0rem "+ tileBorderWidth+"rem" + " black"});
    $(".hoverTile").css({"width": tileSize-tileBorderWidth+"rem", "height": tileSize-tileBorderWidth+"rem", "margin": tileMargins+(tileBorderWidth/2)+"rem", "fontSize": tileSize/2-tileMargins+"rem"});
    $(".hoverCont").css({"width": board_html.style.width, "height": tileFullSize+"rem"});
    
    if (board_html.offsetHeight < board_html.scrollHeight || board_html.offsetWidth < board_html.scrollWidth) {
        $("#board_html").css({"width": tileFullSize * columns + browserAdd+"rem", "height": tileFullSize * rows+"rem"});
    }
    
    const hoverTiles = document.querySelectorAll(".hoverTile");
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        let tileCoords = tile.id.split("-");
        let tileCoordC = parseInt(tileCoords[1]); // Tile coordinate (column)
        $(tile).on({"touchstart": function() {
            $(".hoverCont").hide()
        }});
        $(tile).mouseover(hoverTileCheck).mouseleave(hoverTileLeave);
        $(tile).click(setPiece);
        $(tile).click(hoverTileCheck);

        function hoverTileCheck() { // Change CSS of invisible elements (hoverTiles) above "board_html" to match the current player piece
            if ($(".hoverCont").is(":hidden")) {
                setTimeout(function() {
                    $(".hoverCont").show()
                }, 200)
                return
            }
            else {
                hoverTiles.forEach(hoverTile => {
                    function hoverTileFill(colour, shadowWidth, cursorType) {
                        $(hoverTile).css({"backgroundColor": colour, "boxShadow": "inset 0rem 0rem "+ shadowWidth + " black"})
                        tile.style.cursor = cursorType;
                        hoverTile.innerText = ""
                    }
                    let hoverTileCoordC = parseInt(hoverTile.id)
                    if ((tileCoordC == hoverTileCoordC) || (doublesRow && tileCoordC == hoverTileCoordC-1)) {
                        if (gameOver) {
                            hoverTileFill("transparent", "0rem", "default")
                            return;
                        }
                        if (currPlayer == player_1) {hoverTileFill(colour_1, tileBorderWidth+"rem", "pointer")}
                        else {hoverTileFill(colour_2, tileBorderWidth+"rem", "pointer")};
                        // Change text colour to white for more contrast
                        if (doublesAny && (["forestgreen", "blue", "blueviolet", "lightslategray", "black"].indexOf(hoverTile.style.backgroundColor) > -1)) {hoverTile.style.color = "white"}
                        else {hoverTile.style.color = "black"};
    
                        if (doublesAny && (doublesAnyRound_p1 == 0 || doublesAnyRound_p2 == 0)) {hoverTile.innerText = "x2"};
                        if (doublesAny && (doublesAnyRound_p1 == 1 || doublesAnyRound_p2 == 1)) {hoverTile.innerText = "x1"};
                    }
                })
            }
        }
        function hoverTileLeave() {
            $(".hoverTile").css({"backgroundColor": "transparent", "boxShadow": "inset 0rem 0rem 0rem black"});
            hoverTiles.forEach(hoverTile => {hoverTile.innerText = ""});
        }
    })

    changePlayerColourNumText();

    if (doublesAny) {
        doublesAnyRound_p1 = 0;
        doublesAnyRound_p2 = 0;
    }
}

var dropAddTimeout;
var dropRemoveTimeout;
function setPiece() {
    if (gameOver) {return};

    let pieceCoords = this.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(pieceCoords[0]);
    let c = parseInt(pieceCoords[1]);
    r = currColumns[c]; // Figure out which row the current column should be on
    if (r < 0) {return};
    if (dropRunning) {return};
    dropRunning = true;
    $(".hoverTile").css({"display": "none"});
    $(".tile").css({"pointerEvents": "none"});
    if (doublesRow) {var rDR = currColumns[c+1]}; // r Doubles Row game-mode

    // Falling piece animation
    function placeDrop(dropTileType, colour) {
        dropTileType.style.backgroundColor = colour;
    }

    let dropDelay = 300/r;
    if (r < 6) {dropDelay = 50};
    let iadd = 0;
    let iremove = 0;
    let dropRemoving;
    let dropRemoving_DR;
    dropAdd();
    function dropAdd() {
        if ((r == 0 && doublesRow == false) || (doublesColumn && r < 2 && iadd == 1) || ((r == rDR || rDR == undefined) && r == 0)) {
            setPiece_main();
            dropRunning = false;
            $(".hoverTile").css({"display": "flex"});
            $(".tile").css({"pointerEvents": "auto"});
            return;
        }
        dropAddTimeout = setTimeout(dropAdd, dropDelay);
        if ((iadd == r && doublesRow == false) || (iadd == r && r == rDR)) {clearTimeout(dropAddTimeout)};
        if (doublesColumn && iadd == 2 && r > 0) {dropRemove()};
        if (doublesColumn == false && iadd == 1) {dropRemove()};
        
        if (iadd <= r) {
            let dropPieceAdd = document.getElementById(iadd.toString() + "-" + c.toString());
            currPlayer == player_1 ? placeDrop(dropPieceAdd, colour_1) : placeDrop(dropPieceAdd, colour_2);
        }
        
        if (doublesRow && rDR != undefined && iadd <= rDR) {
            let dropPieceAdd_DR = document.getElementById(iadd.toString() + "-" + (c+1).toString());
            currPlayer == player_1 ? placeDrop(dropPieceAdd_DR, colour_1) : placeDrop(dropPieceAdd_DR, colour_2);
        }

        iadd++;
    }
    function dropRemove() {
        if ((iremove == r && doublesColumn == false && doublesRow == false) || (iremove == r-1 && doublesColumn && r > 1) || (doublesRow && rDR == undefined && iremove == r) || (doublesRow && dropRemoving == false && dropRemoving_DR == false)) {
            clearTimeout(dropRemoveTimeout);
            clearTimeout(dropAddTimeout);
            setPiece_main();
            dropRunning = false;
            $(".hoverTile").css({"display": "flex"});
            $(".tile").css({"pointerEvents": "auto"});
            return;
        }
        dropRemoveTimeout = setTimeout(dropRemove, dropDelay);

        if (iremove < r) {
            let dropPieceRemove = document.getElementById(iremove.toString() + "-" + c.toString());
            placeDrop(dropPieceRemove, "white");
            dropRemoving = true;
        }
        else {
            if (doublesRow && rDR != undefined && iremove == r) {pieceSFX_1.play()};
            dropRemoving = false;
        }

        if (doublesRow && rDR != undefined && iremove < rDR) {
            let dropPieceRemove_DR = document.getElementById(iremove.toString() + "-" + (c+1).toString());
            placeDrop(dropPieceRemove_DR, "white");
            dropRemoving_DR = true;
        }
        else {
            if (doublesRow && rDR != undefined && iremove == rDR && rDR != r) {pieceSFX_2.play()};
            dropRemoving_DR = false;
        }
        iremove++;
    }

    function setPiece_main() {
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let tileDC = document.getElementById((r-1).toString() + "-" + c.toString()); // Extra tile for doublesColumn gamemode, etc.
        if (doublesRow && rDR != undefined) {var tileDR = document.getElementById((rDR).toString() + "-" + (c+1).toString())};
        function updateBoardArray(rVal, cVal) {board[rVal][cVal] = currPlayer};
        updateBoardArray(r, c); // for default gamemode
        if (doublesColumn && tileDC != null) {updateBoardArray(r-1, c)}
        else if (doublesRow && tileDR != null) {updateBoardArray(rDR, c+1)};

        function place(tileType, piece, pieces, colour) {
            $(tileType).addClass(piece);
            $(pieces).each(function() {this.style.backgroundColor = colour});
        }
        if (currPlayer == player_1) {
            place(tile, "piece_1", ".piece_1", colour_1)
            if (doublesColumn && tileDC != null) {place(tileDC, "piece_1", ".piece_1", colour_1)}
            else if (doublesRow && tileDR != null) {place(tileDR, "piece_1", ".piece_1", colour_1)};

            if (doublesAny && doublesAnyRound_p1 < 2) {doublesAnyRound_p1 += 1}
            else if (doublesAny == false) {
                currPlayer = player_2
                changePlayerColourNumText();
            };
        }
        else {
            place(tile, "piece_2", ".piece_2", colour_2)
            if (doublesColumn && tileDC != null) {place(tileDC, "piece_2", ".piece_2", colour_2)}
            else if (doublesRow && tileDR != null) {place(tileDR, "piece_2", ".piece_2", colour_2)};
            
            if (doublesAny && doublesAnyRound_p2 < 2) {doublesAnyRound_p2 += 1}
            else if (doublesAny == false) {
                currPlayer = player_1;
                changePlayerColourNumText();
            };
        }
        if ((doublesRow && rDR == undefined) || (doublesRow && rDR == r) || doublesRow == false) {pieceSFX_1.play()};
        
        if (swapEnabled) { // Swap player pieces when the swapRound is reached, winner is determined after the swap round.
            if (rounds == swapRound) {
                $(".tile").each(function() {
                    function swapPieces(element, removePiece, addPiece, colour) {
                        $(element).removeClass(removePiece).addClass(addPiece);
                        element.style.backgroundColor = colour;
                    }
                    if ($(this).hasClass("piece_1")) {swapPieces(this, "piece_1", "piece_2", colour_2)}
                    else if ($(this).hasClass("piece_2")) {swapPieces(this, "piece_2", "piece_1", colour_1)};
                })
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < columns; c++) {
                        if (board[r][c] == player_1) {board[r][c] = player_2}
                        else if (board[r][c] == player_2) {board[r][c] = player_1};
                    }
                }
                rounds = 0;
                winner.innerText = ("Swap!");
                swapSFX.play();
            }
            rounds += 1;

            function swapText() {
                if (swapRound - rounds == 0 && gameOver == false) {winner.innerText = ("Swap in: " + (swapRound - rounds + 1) + " round")}
                else if (swapRound - rounds > 0 && gameOver == false) {winner.innerText = ("Swap in: " + (swapRound - rounds + 1) + " rounds")};
            }
            if (winner.innerText == "Swap!" && rounds == 1) {var swapTimeout = setTimeout(swapText, 1000)}
            else {swapText()};
            if (winner.innerText == "Swap!" && rounds > 1) {
                clearTimeout(swapTimeout);
                swapText();
            }
        }

        function changeColumns_checkWinner(rVal, cVal) {
            currColumns[cVal] = rVal-1;
            checkWinner();
        }
        changeColumns_checkWinner(r, c) // For default gamemode
        if (doublesColumn && tileDC != null) {changeColumns_checkWinner(r-1, c)} // r-1 because this tile is not empty at this point, the new empty tile would be r-2, unless these reach the end of the row
        else if (doublesRow && tileDR != null) {changeColumns_checkWinner(rDR, c+1)};

        if ($(".tile:not(.piece_1)").length + $(".tile:not(.piece_2)").length - $(".tile").length == 0 && gameOver == false) { // If no empty tiles remain and there is no winner, then gameEnd()
            winner.innerText = "Draw!";
            $("#winner").addClass("animate_1");
            if (blitzEnabled) {blitzStart = false};
            gameEnd();
        }

        if (doublesAny && doublesAnyRound_p1 == 2) {
            doublesAnyRound_p1 = 0;
            currPlayer = player_2;
            changePlayerColourNumText();
        }
        else if (doublesAny && doublesAnyRound_p2 == 2) {
            doublesAnyRound_p2 = 0;
            currPlayer = player_1;
            changePlayerColourNumText();
        }
    }
}

function checkWinner() {
    function checkWinner_main(r, c, ri, ci) { // ri = r increase, etc. Used to check the next index for winning tiles in the board array.
        if (board[r][c] != " ") {
            switch(connectNum) { // Get winning tiles from board array
                case 3:
                    if (board[r][c] == board[r+ri][c+ci] && board[r+ri][c+ci] == board[r+ri*2][c+ci*2]) {
                        highlightWin(r, c);
                        break;
                    }
                case 4:
                    if (board[r][c] == board[r+ri][c+ci] && board[r+ri][c+ci] == board[r+ri*2][c+ci*2] && board[r+ri*2][c+ci*2] == board[r+ri*3][c+ci*3]) {
                        highlightWin(r, c);
                        break;
                    }
                case 5:
                    if (board[r][c] == board[r+ri][c+ci] && board[r+ri][c+ci] == board[r+ri*2][c+ci*2] && board[r+ri*2][c+ci*2] == board[r+ri*3][c+ci*3] && board[r+ri*3][c+ci*3] == board[r+ri*4][c+ci*4]) {
                        highlightWin(r, c);
                        break;
                    }
                case 6:
                    if (board[r][c] == board[r+ri][c+ci] && board[r+ri][c+ci] == board[r+ri*2][c+ci*2] && board[r+ri*2][c+ci*2] == board[r+ri*3][c+ci*3] && board[r+ri*3][c+ci*3] == board[r+ri*4][c+ci*4] && board[r+ri*4][c+ci*4] == board[r+ri*5][c+ci*5]) {
                        highlightWin(r, c);
                        break;
                    }
            }
            function highlightWin(r, c) {
                for (let i = 0; i < connectNum; i++) { // Get each winning tile by element ID in order to add blink
                    switch(true) {
                        case ri == 0 && ci == 1: // Horizontal
                            var winningTile = document.getElementById(r.toString() + "-" + (c+i).toString());
                            break;
                        case ri == 1 && ci == 0: // Vertical
                            var winningTile = document.getElementById((r+i).toString() + "-" + c.toString());
                            break;
                        case ri == 1 && ci == 1: // Anti-diagonal (\)
                            var winningTile = document.getElementById((r+i).toString() + "-" + (c+i).toString());
                            break;
                        case ri == -1 && ci == 1: // Diagonal (/)
                            var winningTile = document.getElementById((r-i).toString() + "-" + (c+i).toString());
                            break;
                    }
                    winningTile.classList.add("blinkTile");
                }
                setWinner(r, c);
                return;
            }
        }
    }
  
    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - connectNeg; c++) {
            checkWinner_main(r, c, 0, 1);
        }
    }
    // Vertical
    for (let r = 0; r < rows - connectNeg; r++) {
        for (let c = 0; c < columns; c++) {
            checkWinner_main(r, c, 1, 0);
        }
    }
    // Anti-diagonal (\)
    for (let r = 0; r < rows - connectNeg; r++) {
        for (let c = 0; c < columns - connectNeg; c++) {
            checkWinner_main(r, c, 1, 1);
        }
    }
    // Diagonal (/)
    for (let r = connectNeg; r < rows; r++) {
        for (let c = 0; c < columns - connectNeg; c++) {
            checkWinner_main(r, c, -1, 1);
        }
    }
}

function colourAnimation() {
    if (winner.innerText == "Player 1 wins!") {
        root.style.setProperty("--blinkBorderColour", colour_1);
        root.style.setProperty("--winnerTextColour", colour_1);
        if (colour_1 == "black") {
            root.style.setProperty("--blinkBorderColour", "white");
            root.style.setProperty("--winnerTextColour", "white");
        }
    }
    else if (winner.innerText == "Player 2 wins!") {
        root.style.setProperty("--blinkBorderColour", colour_2);
        root.style.setProperty("--winnerTextColour", colour_2);
        if (colour_2 == "black") {
            root.style.setProperty("--blinkBorderColour", "white");
            root.style.setProperty("--winnerTextColour", "white");
        }
    }
}

function setWinner(r, c) {
    if (board[r][c] == player_1) {winner.innerText = "Player 1 wins!"} 
    else if (board[r][c] == player_2) {winner.innerText = "Player 2 wins!"};
    if (blitzEnabled) {blitzStart = false};
    winner.classList.add("animateText");
    $("#winner").addClass("animate_1");
    colourAnimation();
    winnerSFX.play();
    gameEnd();
}


function setWinner_countdown() {
    if (countdown_2.innerText == "0:00") {
        winner.innerText = "Player 1 wins!";    
        countdown_2.classList.add("blinkCountdown");
    }
    else if (countdown_1.innerText == "0:00") {
        winner.innerText = "Player 2 wins!";
        countdown_1.classList.add("blinkCountdown");
    }
    if (blitzEnabled) {blitzStart = false};
    winner.classList.add("animateText");
    $("#winner").addClass("animate_1");
    colourAnimation();
    gameEnd();
}

function gameEnd() {
    clearTimeout(dropAddTimeout);
    clearTimeout(dropRemoveTimeout);
    dropRunning = false;
    $(".tile").css({"pointerEvents": "auto"});
    $(".clockIcon").removeClass("animate_1");
    $(".hoverTile").css({"backgroundColor": "transparent", "boxShadow": "inset 0rem 0rem 0rem black"});
    gameOver = true;
    let resetButton = document.getElementById("resetButton");
    blitzStart ? resetButton.innerText = "Start" : resetButton.innerText = "Reset";
    if (winner.innerText == "Draw!") {resetButton.innerText = "Reset";}
    $("#resetButton").addClass("animate_1");
    resetButton.addEventListener("click", resetGame);
    if (updateCountdown_running) {clearInterval(playerTime)};
}

function resetGame() {
    clearTimeout(dropAddTimeout);
    clearTimeout(dropRemoveTimeout);
    dropRunning = false;
    $(".tile").css({"pointerEvents": "auto"});
    $("#resetButton").removeClass("animate_1");
    gameOver = false;
    board_html.remove();
    $(".hoverTile").remove();
    $(".countdown").removeClass("blinkCountdown");
    $("#winner").removeClass("animateText");
    $("#winner").removeClass("animate_1");

    currColumnsSize = [];
    var rowNeg = rows - 1;  // "rowNeg" = rows "negated" by one
    // "columns" = number of indexes, "rowNeg" = item/value in index. e.g. if columns = 5 and rowNeg = 4, then currColumnsSize = [4, 4, 4, 4, 4]
    for (let i = 0; i < columns; i++) {currColumnsSize.splice(i, 0, rowNeg)};

    if (blitzEnabled == true) {
        let time = startMin * 600;
        let p1_time = time;
        let p2_time = time;
        countdown_1.innerText = startMin + ":00";
        countdown_2.innerText = startMin + ":00";
            
        playerTime = setInterval(updateCountdown, 100);
        function updateCountdown() {
            updateCountdown_running = true;
            const p1_minutes = Math.floor(p1_time / 600);
            let p1_tenthSeconds = p1_time % 600; // A tenth of a second, for more accurate player times
            let p1_seconds_html = Math.floor(p1_tenthSeconds/10);
            const p2_minutes = Math.floor(p2_time / 600);
            let p2_tenthSeconds = p2_time % 600;
            let p2_seconds_html = Math.floor(p2_tenthSeconds/10);
            
            if (currPlayer == player_1) {
                p1_seconds_html = p1_seconds_html < 10 ? "0" + p1_seconds_html : p1_seconds_html; // If seconds less than 10, adds "0" char next to it, else display as normal
                countdown_1.innerText = p1_minutes + ":" + p1_seconds_html;
                p1_time--;
                $("#clockIcon_1").addClass("animate_1");
                $("#clockIcon_2").removeClass("animate_1");
            }
            else if (currPlayer == player_2) {
                p2_seconds_html = p2_seconds_html < 10 ? "0" + p2_seconds_html : p2_seconds_html;
                countdown_2.innerText = p2_minutes + ":" + p2_seconds_html;
                p2_time--;
                $("#clockIcon_1").removeClass("animate_1");
                $("#clockIcon_2").addClass("animate_1");    
            }

            if (countdown_1.innerText == "0:01" || countdown_2.innerText == "0:01") {winnerSFX.play()}; // Due to sound delay
            if (countdown_1.innerText == "0:00" || countdown_2.innerText == "0:00") {
                setWinner_countdown();
                clearInterval(playerTime);
                updateCountdown_running = false;
            }
            else if (gameOver == true) {
                clearInterval(playerTime);
                updateCountdown_running = false;
            }   
        }
    }

    setGame();
}

function handleBlitzOverlap() {
    const clockIcon_1 = document.querySelector("#clockIcon_1")
    rect = clockIcon_1.getBoundingClientRect();
    x = rect.left;
    y = rect.top;
    topElt = document.elementFromPoint(x, y);
    if (clockIcon_1.isSameNode(topElt)) {
        console.log('no overlapping');
    }
}
$(window).on('resize', function() { // If window width is resized, run functions
    handleBlitzOverlap();
})
handleBlitzOverlap();



