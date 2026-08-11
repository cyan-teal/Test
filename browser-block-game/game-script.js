// Set up for the game

// variables for the Canvas API
const can = document.querySelector("canvas");
const ctx = can.getContext("2d");

// declaration of most variable
// note that most variables are not well named
let pX;
let pY; 
let pT;
let num;
let oX; 
let oY; 
let oXv;
let oYv; 
let lastUpdate = Date.now();
let D = 100;  
let cur; 
let floor; 
let spec;
let net = 1;
let g;
const orange = 250;

// Player 2 here
let oXW; 
let oYW; 
let oXvW;
let oYvW; 
let floorW; 
let aW = 0;
let dkW = 0;
let wW = 0;
let sW = 0;

// Buttons. e.g. W,A,S;D.
let a = 0;
let dk = 0;
let w = 0;
let s = 0;

// Mouse-positioning:
let X;
let Y;

// Sets up necessary event listeners than trigger the main game loop
redo();
document.querySelector("h3").addEventListener("click", notify);
window.addEventListener("resize", redo);
window.addEventListener("keydown", lower);
window.addEventListener("keyup", high);
window.addEventListener("mousedown", fix)
window.addEventListener("mouseup", repair)
window.addEventListener("mousemove", shift);
requestAnimationFrame(loop);

// Tells Player controls.
function notify() {
    alert("WASD / Arrows to move, mouse to build, and Space to cycle blocks.");
}

// Handle actions following the mouse going down.
function fix() {
    s = 1;
    document.querySelector("canvas").style.cursor = "copy";
}

// Same as previous but for release and not as important.
function repair() {
    s = 0;
    document.querySelector("canvas").style.cursor = "grab";
}

// updates variables for mouse position upon its movement.
function shift() {
    X = Math.round((event.clientX - 25) / 50) * 50;
    Y = Math.round((event.clientY - 25) / 50) * 50;
}

// says when a key's held.
function lower() {
    let it = event.key;
    if (it == "ArrowLeft") {
        a = 1;
    } else if (it == "q") {
        // 'Q' is a shortcut for testing:
        // it shows these 3 arrays which hold all the information for block: x positions, y positions and types.
        alert(pX);
        alert(pY);
        alert(pT);
    } else if (it == "ArrowRight") {
        dk = 1;
    } else if (it == "ArrowUp") {
        w = 20;
    } else if (it == " ") {
        net = (net + 1) % 5;
    } else if (it == "z") {
        alert(1000 / D);
    } else if (it == "ArrowDown") {
        X = Math.floor((oX + 17.5) / 50) * 50;
        Y = Math.floor((oY + 105) / 50) * 50;
        spec = "true";
        s = 1;
    }

    
    if (it == "a") {
        aW = 1;
    } else if (it == "d") {
        dkW = 1;
    } else if (it == "w") {
        wW = 20;
    }
}

// says when a key's no longer held.
function high() {
    let it = event.key;
    if (it == "ArrowLeft") {
        a = 0;
    } else if (it == "ArrowRight") {
        dk = 0;
    } else if (it == "ArrowUp") {
        w = 0;
    } else if (it == "ArrowDown") {
        spec = "false";
        s = 0;
    }
    
    if (it == "a") {
        aW = 0;
    } else if (it == "d") {
        dkW = 0;
    } else if (it == "w") {
        wW = 0;
    }
}

// procedurally generate the map
function creation() {
    let ran = Math.round(((can.height - 25) / 1.5) / 50) * 50;
    for (let v = 0; v * 50 <= can.width; v++) {
        ran += Math.round((Math.random() - 0.5) * 2) * 50;
        for (let h = ran / 50; h * 50 <= can.height; h++) {
            place(v * 50, h * 50, 4);
        }
}}

// reloads/resets the game when called.
function redo() {
    can.width = Math.floor(visualViewport.width / 50) * 50;
    can.height = Math.floor(visualViewport.height / 50) * 50 - clamp(36, visualViewport.width / 20, 108);
    pX = [];
    pY = [];
    pT = [];
    num = 0;
    oXv = 0;
    oYv = 0;
    oX = (can.width - 35) / 2;
    oY = -80;
    oXvW = 0;
    oYvW = 0;
    oXW = (can.width - 35) / 3 * 2;
    oYW = -80 - 800;
    creation();
}

// mimics the CSS "clamp"feature so the canvas can fit atop other things.
function clamp(int, down, up) {
    return Math.min(Math.max(int, down), up);
}

// main-game-loop; calls all other functions to act.
function loop() {
    let now = Date.now();
    D = now - lastUpdate; // D = Delta time.
    lastUpdate = now;

    con(); //- Controls
    conW()
    col(); //- Collisions
    colW();
    pos(); //- Positioning
    posW()
    make(); //- Making
    let abc
    if (net == 0) {
        abc = "Air";
    } else if (net == 1) {
        abc = "Planks";
    } else if (net == 2) {
        abc = "Glass";
    } else if (net == 3) {
        abc = "Sand";
    } else {
        abc = "Grass"
    }
    document.getElementById("block").textContent = abc;
    requestAnimationFrame(loop);
}

// interprets inputs as controls
function con() {
    if (a == 1) {
        oXv -= .1 * D;
    }
    if (dk == 1) {
        oXv += .1 * D;
    }
    if (s == 1 && dist() <= orange) {
            place(X, Y, net);
    }
    if (w >= 10 && floor >= 1) {
        oYv = -1.25 * D;
        //w = 0;
}}

// interprets inputs as controls for second player
function conW() {
    if (aW == 1) {
        oXvW -= .1 * D;
    }
    if (dkW == 1) {
        oXvW += .1 * D;
    }
    if (sW == 1 && dist() <= orange) {
            place(X, Y, net);
    }
    if (wW >= 10 && floorW >= 1) {
        oYvW = -1.25 * D;
        //wW = 0;
}}

// returns distance between player and cursor.
function dist() {
    return Math.sqrt(Math.pow(X - oX, 2) + Math.pow(Y - oY, 2));//- Complicated maths; I searched up the formula
}

// following 2 functions used for positioning blocks based off mouse position(variables X and Y).

// ^
function checkB() {
    if (Y >= oY + 65) {
        return 65;
    } else if (Y >= oY + 40) {
        return 25;
    } else if (Y <= oY - 65) {
        return -65;
    } else if (Y <= oY - 40) {
        return -25;
    } else {
        return 0;
}}

// ^^
function checkA() {
    if (X >= oX + 17.5) {
        return 42.5;
    } else if (X <= oX - 17.5) {
        return -42.5;
    } else {
        return 0;
}}

// used for adding new blocks.
function place(X, Y, T) {
    let skip = "no";
    for (let i = 0; i <= pT.length; i++) { 
            if (pX[i] == Math.floor(X) && pY[i] == Math.floor(Y)) {
                if (pT[i] != 0 && T != 0) {
                    skip = "stillno" 
                } else {
                    skip = i; //Decides to skip placements if theirs already something there(except air).
            }}
        }
        if (skip == "no") {
            pX[num] = Math.floor(X);
            pY[num] = Math.floor(Y);
            pT[num] = Math.floor(T);
            num ++;
        } else if (skip != "stillno") {
            pX[skip] = Math.floor(X);
            pY[skip] = Math.floor(Y);
            pT[skip] = Math.floor(T);
    }}


// Draws what's happening onto the html canvas.
function make() {
    ctx.clearRect(0, 0, can.width, can.height);

    /*ctx.fillStyle = "red";
    ctx.fillRect(oX, oY, 35, 80);*/
    // ^^ shows player hit-box, a red rectangle(used for testing).

    // draws player character
    ctx.fillStyle = "#0eaeae";
    ctx.fillRect(oX - 8.75, oY + 10, 52.5, 40);
    ctx.fillStyle = "#a97d64";
    ctx.fillRect(oX + 5, oY - 15, 25, 25);
    ctx.fillRect(oX - 8.75, oY + 20, 12.5, 30);
    ctx.fillRect(oX + 30, oY + 20, 12.5, 30);
    ctx.fillStyle = "#5C4033";
    ctx.fillRect(oX + 5, oY - 15, 25, 10);
    ctx.fillStyle = "#494697";
    ctx.fillRect(oX + 5, oY + 50, 25, 30);

    // draws the second player character
    ctx.fillStyle = "#8cbe8a";
    ctx.fillRect(oXW - 8.75, oYW + 10, 52.5, 40);
    ctx.fillStyle = "#f2daba";
    ctx.fillRect(oXW + 5, oYW - 15, 25, 25);
    ctx.fillRect(oXW - 8.75, oYW + 20, 12.5, 30);
    ctx.fillRect(oXW + 30, oYW + 20, 12.5, 30);
    ctx.fillStyle = "#e59947";
    ctx.fillRect(oXW + 5, oYW - 15, 25, 10);
    ctx.fillStyle = "#684530";
    ctx.fillRect(oXW + 5, oYW + 50, 25, 30);

    // draws various blocks onto the map
    for (let i = 0; i < num; i++) {
        if (pT[i] == 4) { // grass blocks
            ctx.fillStyle = "rgb(158, 32, 21)";
            ctx.fillRect(pX[i], pY[i], 50, 50);
            ctx.fillStyle = "rgb(31, 184, 58)";
            ctx.fillRect(pX[i], pY[i], 50, 15);
        } else if (pT[i] == 1) { // oak planks
            ctx.fillStyle = "sandybrown";
            ctx.fillRect(pX[i], pY[i], 50, 50);
            ctx.fillStyle = "saddlebrown";
            ctx.fillRect(pX[i], pY[i] + 7.5, 50, 5);
            ctx.fillRect(pX[i], pY[i] + 22.5, 50, 5);
            ctx.fillRect(pX[i], pY[i] + 37.5, 50, 5);
        } else if (pT[i] == 2) { // glass blocks
            ctx.fillStyle = "rgba(205, 200, 220, 0.55)";
            ctx.fillRect(pX[i], pY[i], 50, 50);
            ctx.fillStyle = "white";
            ctx.fillRect(pX[i], pY[i] + 7.5, 50, 0.75);
            ctx.fillRect(pX[i], pY[i] + 22.5, 50, 0.75);
            ctx.fillRect(pX[i], pY[i] + 37.5, 50, 0.75);
        } else if (pT[i] == 3) { // sand blocks
            if (fall(pX[i], pY[i]) == "good") {

                pY[i] += 50; 
            }
            ctx.fillStyle = "#fae8b4";
            ctx.fillRect(pX[i], pY[i], 50, 50);
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            ctx.fillRect(pX[i], pY[i] + 5, 50, 2.75);
            ctx.fillRect(pX[i], pY[i] + 17.5, 50, 7.5);
            ctx.fillRect(pX[i], pY[i] + 35, 50, 15);
        }
        if (pT[i] != 0 && pT[i] != 2) {
            ctx.strokeStyle = "black"; // outline for most blocks
            ctx.lineWidth = "1";
            ctx.strokeRect(pX[i], pY[i], 50, 50);

            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.fillRect(pX[i], pY[i], 50, can.height);
            ctx.globalCompositeOperation = "source-over";
}}

    let a = checkA() + 17.5;
    let b = checkB() + 40;
    ctx.lineWidth = "2";
    ctx.strokeStyle = "white";
    if (net != 0) {
        if (dist() <= orange) {

            for (let i = 0; i < num; i++) {
                if (pX[i] == Math.floor(X) && pY[i] == Math.floor(Y) && pT[i] != 0) {
                    ctx.strokeStyle = "red";
                    break;
                }
            }
        } else {
            ctx.strokeStyle = "red";
    }} else {
        if (dist() >= orange) {ctx.strokeStyle = "red";}
    }
    ctx.strokeRect(X, Y, 50, 50);
}

// checks then triggers falling-sand.
function fall(C, U) {
    for (let x = 0; x < num; x ++) {
        if (C == pX[x] && U == pY[x] - 50 && pT[x] != 0) {
            return "no";
    }}
    let p = Math.round(Math.random() - 0.00033 * D)
    if (p == 1) {
    return "good";
}}

// positioning/Movement for the player.
function pos() {
    if (oYv != 0) {
        oYv *= 0.85;
    }
    if (oXv != 0) {
        oXv *= 0.85;
    }
    if (floor == 1) {
        oY -= 1;
        if (oYv >= 0) {
            oYv = 0;
        }
    } else {
        oYv += .075 * D;
    }
    oX += oXv;
    oY += oYv;
    if (oY >= can.height && oYW >= can.height) {
        redo();
    }
}

// positioning/Movement for the seconds player.
function posW() {
    if (oYvW != 0) {
        oYvW *= 0.85;
    }
    if (oXvW != 0) {
        oXvW *= 0.85;
    }
    if (floorW == 1) {
        oYW -= 1;
        if (oYvW >= 0) {
            oYvW = 0;
        }
    } else {
        oYvW += .075 * D;
    }
    oXW += oXvW;
    oYW += oYvW;
    if (oYW >= can.height && oY >= can.height) {
        redo();
    }
}

// standardises positions onto the grid for checking.
function C(method, offput) {
    return Math.floor((method + offput) / 50) * 50;
}


// defines collisions for the player.
function col() {
    let hey = "k";
    // translates Player positions onto the grid too, To match.
    let okX = Math.floor((oX) / 50) * 50;
    let okX2 = Math.floor((oX + 35) / 50) * 50;
    let okY = Math.floor((oY + 105) / 50) * 50;
    let okY2 = Math.floor((oY + 80) / 50) * 50;
    for (let i = 0; i <= pT.length; i++) {
        if (pT[i] != 0) {
            // floor and ceiling collisions(vertical).
            if (pY[i] <= C(oY, 80) && pY[i] >= C(oY, 105) && pX[i] >= C(oX, 10) && pX[i] <= C(oX, 25)) {
                hey = "nok";
                floor = 1;
            } else if (hey == "k") {
                floor -= 1 * D;
            }
            if (pY[i] >= C(oY, -10) && pY[i] <= C(oY, 25) && pX[i] >= C(oX, 10) && pX[i] <= C(oX, 25)) {
                oYv = 0;
                oY ++;
            }

            // wall collisions(horizontal).
            if (pY[i] <= C(oY, 75) && pY[i] >= C(oY, 15) && floor != 10 && pX[i] >= C(oX, 35) && pX[i] <= C(oX, 35)) {
                    oXv = 0;
                    oX --;
            }
            if (pY[i] <= C(oY, 75) && pY[i] >= C(oY, 15) && floor != 10 && pX[i] >= C(oX, 0) && pX[i] <= C(oX, -35)) {
                oXv = 0;
                oX ++;
            
            }
        }
    }
 }

// defines collisions for the second player.
function colW() {
    let hey = "k";
    // translates Player positions onto the grid too, To match.
    let okX = Math.floor((oXW) / 50) * 50;
    let okX2 = Math.floor((oXW + 35) / 50) * 50;
    let okY = Math.floor((oYW + 105) / 50) * 50;
    let okY2 = Math.floor((oYW + 80) / 50) * 50;
    for (let i = 0; i <= pT.length; i++) {
        if (pT[i] != 0) {
            // floor and ceiling collisions(vertical).
            if (pY[i] <= C(oYW, 80) && pY[i] >= C(oYW, 105) && pX[i] >= C(oXW, 10) && pX[i] <= C(oXW, 25)) {
                hey = "nok";
                floorW = 1;
            } else if (hey == "k") {
                floorW -= 1 * D;
            }
            if (pY[i] >= C(oYW, -10) && pY[i] <= C(oYW, 25) && pX[i] >= C(oXW, 10) && pX[i] <= C(oXW, 25)) {
                oYvW = 0;
                oYW ++;
            }

            // wall collisions(horizontal).
            if (pY[i] <= C(oYW, 75) && pY[i] >= C(oYW, 15) && floor != 10 && pX[i] >= C(oXW, 35) && pX[i] <= C(oXW, 35)) {
                    oXvW = 0;
                    oXW --;
            }
            if (pY[i] <= C(oYW, 75) && pY[i] >= C(oYW, 15) && floor != 10 && pX[i] >= C(oXW, 0) && pX[i] <= C(oXW, -35)) {
                oXvW = 0;
                oXW ++;
}}}}