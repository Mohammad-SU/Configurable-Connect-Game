$("#colourCollapser").click(function() {
    if ($("#colourContent").css("width") != "0px") {
        $("#colourContent").css({"width": "0"})
        $("#colourCollapser").css({"marginLeft": "0"})
        $(".colourArrow.topArrow").css({"rotate": "0deg"})
        $(".colourArrow.bottomArrow").css({"rotate": "0deg"})
    } 
    else {
        $("#colourContent").css({"width": "21.875rem"})
        $("#colourCollapser").css({"marginLeft": "21.875rem"})
        $(".colourArrow.topArrow").css({"rotate": "-180deg"})
        $(".colourArrow.bottomArrow").css({"rotate": "180deg"})
    }
})

let colourTile_1 = document.getElementsByClassName("colourTile one");
let colourTile_2 = document.getElementsByClassName("colourTile two");
function colourTileSet(colourTile) {
    colourTile[0].style.backgroundColor = "red";
    colourTile[0].innerText = "1";
    colourTile[1].style.backgroundColor = "yellow";
    colourTile[1].innerText = "2";
    colourTile[2].style.backgroundColor = "lime";
    colourTile[3].style.backgroundColor = "forestgreen";
    colourTile[4].style.backgroundColor = "cyan";
    colourTile[5].style.backgroundColor = "blue";
    colourTile[6].style.backgroundColor = "blueviolet";
    colourTile[7].style.backgroundColor = "magenta";
    colourTile[8].style.backgroundColor = "pink";
    colourTile[9].style.backgroundColor = "chocolate";
    colourTile[10].style.backgroundColor = "lightslategray";
    colourTile[11].style.backgroundColor = "black";
}
colourTileSet(colourTile_1);
colourTileSet(colourTile_2);

var colour_1 = "red";
var colour_2 = "yellow";

let PCC_1 = document.getElementById("PCC_1"); //PCC = PlayerColourChoice
let PCC_2 = document.getElementById("PCC_2");

const colourTile_1s = document.querySelectorAll(".colourTile.one");
const colourTile_2s = document.querySelectorAll(".colourTile.two");

function changeColour_1() { 
    if (this.innerText == "1" || this.innerText == "2") {return}; // If a colour is already selected by player 1 or player 2 and is then clicked, return nothing.
    colourTile_1s.forEach(colourTile_1 => {
        if (colourTile_1.innerText == "1") {colourTile_1.innerText = ""}; // Display "1" on the selected element, remove "1" from the element if a different element is selected.
    })
    colourTile_2s.forEach(colourTile_2 => { // Do the same for the other player's colour grid.
        if (colourTile_2.innerText == "1") {colourTile_2.innerText = ""}; 
        if (colourTile_2.style.backgroundColor == this.style.backgroundColor) {colourTile_2.innerText = "1"};
        // Change text colour to "white" for more contrast
        if (["forestgreen", "blue", "blueviolet", "lightslategray", "black"].indexOf(colourTile_2.style.backgroundColor) > -1) {colourTile_2.style.color = "white"};
    })
    this.innerText = "1";
    if (["forestgreen", "blue", "blueviolet", "lightslategray", "black"].indexOf(this.style.backgroundColor) > -1) {this.style.color = "white"};

    colour_1 = this.style.backgroundColor;
    $(".piece_1").css({"backgroundColor": colour_1});
    PCC_1.style.backgroundColor = colour_1;
    root.style.setProperty("--headerFirstColour", colour_1);
    colourAnimation();
    changePlayerColourNumText();
}

function changeColour_2() {
    if (this.innerText == "2" || this.innerText == "1") {return};
    colourTile_2s.forEach(colourTile_2 => {
        if (colourTile_2.innerText == "2") {colourTile_2.innerText = ""};
    });
    colourTile_1s.forEach(colourTile_1 => {
        if (colourTile_1.innerText == "2") {colourTile_1.innerText = ""};
        if (colourTile_1.style.backgroundColor == this.style.backgroundColor) {colourTile_1.innerText = "2"};
        if (["forestgreen", "blue", "blueviolet", "lightslategray", "black"].indexOf(colourTile_1.style.backgroundColor) > -1) {colourTile_1.style.color = "white"};
    });
    this.innerText = "2";
    if (["forestgreen", "blue", "blueviolet", "lightslategray", "black"].indexOf(this.style.backgroundColor) > -1) {this.style.color = "white"};

    colour_2 = this.style.backgroundColor;
    $(".piece_2").css({"backgroundColor": colour_2});
    PCC_2.style.backgroundColor = colour_2;
    root.style.setProperty("--headerLastColour", colour_2);
    colourAnimation();
    changePlayerColourNumText();
}

document.querySelectorAll(".colourTile.one").forEach(function(element) {element.addEventListener('click', changeColour_1);});
document.querySelectorAll(".colourTile.two").forEach(function(element) {element.addEventListener('click', changeColour_2);});
