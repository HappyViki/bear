// Setup game board

const gameSize = 5;

let html = '';
for (let y = -gameSize; y <= gameSize; y++) {
    html += '<div class="row">';
    for (let x = -gameSize; x <= gameSize; x++) {
        html += `<div id="${'x' + x + 'y' + y}" class="box" x="${x}" y="${y}"></div>`;
    }
    html += '</div>';
}
container.innerHTML = html;

let points = 0;
let gameOver = false;

let foe = {
    x: 0,
    y: 0
}

let player = {
    x: 0,
    y: 0
}

const setupLevel = () => {
    level.map(path => document.querySelector('#x' + path.x + 'y' + path.y)).forEach(el => {
        el.classList.add("path");
        el.innerHTML += `<div class="honey"></div>`;
    });
};

const getCloserSpace = (mover1, mover2) => {
    const paths = [
        document.querySelector('#x' + mover1.x + 'y' + (mover1.y - 1)),
        document.querySelector('#x' + mover1.x + 'y' + (mover1.y + 1)),
        document.querySelector('#x' + (mover1.x - 1) + 'y' + mover1.y),
        document.querySelector('#x' + (mover1.x + 1) + 'y' + mover1.y)
    ].filter(x => x?.classList.contains('path')).sort((itemA, itemB) => {
        const xDistA = itemA.getAttribute("x") - mover2.x;
        const yDistA = itemA.getAttribute("y") - mover2.y;
        const xDistB = itemB.getAttribute("x") - mover2.x;
        const yDistB = itemB.getAttribute("y") - mover2.y;

        const absA = Math.abs(xDistA) + Math.abs(yDistA);
        const absB = Math.abs(xDistB) + Math.abs(yDistB);
        return absA - absB;
    });

    const n = 0; // TODO: get random of same distance items

    const nextPath = paths[n];

    return { x: Number(nextPath.getAttribute("x")), y: Number(nextPath.getAttribute("y"))};
};

const moveFoe = (x, y) => {
    // validate
    const newLocation = { x, y };
    const onPath = document.querySelector('#x' + newLocation.x + 'y' + newLocation.y)?.classList.contains('path');

    if (!onPath) {
        return;
    }

    // set foe location
    foe = newLocation;

    // remove old foe
    document.querySelector('.foe')?.classList.remove("foe");

    // add new foe
    document.querySelector('#x' + foe.x + 'y' + foe.y)?.classList.add("foe");

    // collect honey
    document.querySelector('#x' + foe.x + 'y' + foe.y + ' .honey')?.remove();
};

const movePlayer = (x, y) => {
    if (gameOver) return;

    // validate
    const newLocation = { x: player.x + x, y: player.y + y };
    const onPath = document.querySelector('#x' + newLocation.x + 'y' + newLocation.y)?.classList.contains('path');
    const onHoney = !!document.querySelector('#x' + newLocation.x + 'y' + newLocation.y + ' .honey');    

    if (!onPath) {
        return;
    }

    // set player location
    player = newLocation;

    // remove old player
    document.querySelector('.player')?.classList.remove("player");

    // add new player
    document.querySelector('#x' + player.x + 'y' + player.y)?.classList.add("player");

    // collect honey
    document.querySelector('#x' + player.x + 'y' + player.y + ' .honey')?.remove();   
    
    const honeyAmount = document.querySelectorAll('.honey').length;

    // get points
    if (onHoney) {
        points++;
        pointsEl.innerHTML = points;
    } if (!honeyAmount) {
        text.innerHTML = "You Win!";
        gameOver = true;
    }
};

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        e.preventDefault();
        movePlayer(0, -1);
    }
    else if (e.keyCode == '40') {
        // down arrow
        e.preventDefault();
        movePlayer(0, 1);
    }
    else if (e.keyCode == '37') {
        // left arrow
        e.preventDefault();
        movePlayer(-1, 0);
    }
    else if (e.keyCode == '39') {
        // right arrow
        e.preventDefault();
        movePlayer(1, 0);
    }

}

// Foe move

const movingFoe = setInterval((moveFoe)=>{
    const nextMove = getCloserSpace(foe, player);

    const touchingPlayer = document.querySelector('#x' + (nextMove.x) + 'y' + (nextMove.y) + '.player');

    if (!!touchingPlayer) {
        touchingPlayer.classList.remove("player")
        text.innerHTML = "Game over dude!";
        gameOver = true;
    }

    moveFoe(nextMove.x, nextMove.y);
    if (gameOver) clearInterval(movingFoe);
}, 500, moveFoe);

// Play!
setupLevel();
movePlayer(0, 0);
moveFoe(5, 5);
document.onkeydown = checkKey;

// Mobile friendly
up.addEventListener("pointerdown", () => movePlayer(0, -1));
down.addEventListener("pointerdown", () => movePlayer(0, 1));
left.addEventListener("pointerdown", () => movePlayer(-1, 0));
right.addEventListener("pointerdown", () => movePlayer(1, 0));

// Create custom level

// container.innerHTML += "<button id='getLevel'>Get Level</button>";

// [...document.querySelectorAll(".box")].forEach(x=>{
//     x.addEventListener("click", e=>{
//         e.target.classList.toggle("path");
//     })
// })

// getLevel.addEventListener("click", e => {
//     const path = [...document.querySelectorAll(".path")].map(item=>{
//         return { x: item.getAttribute("x"), y: item.getAttribute("y")}
//     })
//     console.log("level:", path);
// })