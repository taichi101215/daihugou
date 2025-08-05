const suits = ["♠", "♥", "♦", "♣"];
let deck = [];
let players = [[], [], [], []]; // player:0, cpu1:1, cpu2:2, cpu3:3
let field = [];
let currentPlayer = 0;
let selectedCards = [];
let passCount = 0;
let revolution = false;

const handDiv = document.getElementById("hand");
const fieldDiv = document.getElementById("field-cards");
const message = document.getElementById("message");
const currentPlayerLabel = document.getElementById("current-player");

function init() {
    deck = [];
    for (let s of suits) {
        for (let r = 3; r <= 15; r++) { // 11=J,12=Q,13=K,14=A,15=2
            deck.push({ suit: s, rank: r });
        }
    }
    deck.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 4; i++) players[i] = [];
    deck.forEach((c, i) => players[i % 4].push(c));
    players.forEach(p => p.sort((a, b) => a.rank - b.rank));
    updateUI();
}

function rankToStr(r) {
    if (r <= 10) return r;
    return {11:"J",12:"Q",13:"K",14:"A",15:"2"}[r];
}

function renderHand() {
    handDiv.innerHTML = "";
    players[0].forEach((card, i) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerText = `${card.suit}\n${rankToStr(card.rank)}`;
        div.onclick = () => {
            if (selectedCards.includes(i)) {
                selectedCards = selectedCards.filter(x => x !== i);
                div.classList.remove("selected");
            } else {
                selectedCards.push(i);
                div.classList.add("selected");
            }
        };
        handDiv.appendChild(div);
    });
}

function renderField() {
    fieldDiv.innerHTML = "";
    field.forEach(c => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerText = `${c.suit}\n${rankToStr(c.rank)}`;
        fieldDiv.appendChild(div);
    });
}

function updateUI() {
    renderHand();
    renderField();
    currentPlayerLabel.textContent = `現在のプレイヤー: ${["あなた","CPU1","CPU2","CPU3"][currentPlayer]}`;
}

function canPlay(cards) {
    if (cards.length === 0) return false;
    if (field.length === 0) return true; 
    if (cards.length !== field.length) return false;
    const top = cards[0].rank;
    if (!cards.every(c => c.rank === top)) return false; 
    const fieldRank = field[0].rank;
    return revolution ? top < fieldRank : top > fieldRank;
}

document.getElementById("play-btn").onclick = () => {
    const chosen = selectedCards.map(i => players[0][i]);
    if (canPlay(chosen)) {
        field = chosen;
        chosen.forEach(c => players[0].splice(players[0].indexOf(c), 1));
        selectedCards = [];
        passCount = 0;
        updateUI();
        nextTurn();
    } else {
        message.textContent = "出せません！";
    }
};

document.getElementById("pass-btn").onclick = () => {
    passCount++;
    if (passCount >= 3) { field = []; passCount = 0; }
    nextTurn();
};

function nextTurn() {
    if (players[0].length === 0) { message.textContent = "あなたが上がりました！勝利！"; return; }
    currentPlayer = (currentPlayer + 1) % 4;
    updateUI();
    if (currentPlayer !== 0) setTimeout(cpuPlay, 1000);
}

function cpuPlay() {
    const cpu = players[currentPlayer];
    let playable = [];
    if (field.length === 0) {
        playable.push([cpu[0]]);
    } else {
        for (let i = 0; i < cpu.length; i++) {
            const card = cpu[i];
            if ((revolution ? card.rank < field[0].rank : card.rank > field[0].rank)) {
                playable.push([card]);
                break;
            }
        }
    }
    if (playable.length > 0) {
        field = playable[0];
        cpu.splice(cpu.indexOf(field[0]), 1);
        passCount = 0;
    } else {
        passCount++;
        if (passCount >= 3) { field = []; passCount = 0; }
    }
    if (cpu.length === 0) { message.textContent = `${["あなた","CPU1","CPU2","CPU3"][currentPlayer]}が上がりました！`; }
    currentPlayer = (currentPlayer + 1) % 4;
    updateUI();
    if (currentPlayer !== 0) setTimeout(cpuPlay, 1000);
}

init();
