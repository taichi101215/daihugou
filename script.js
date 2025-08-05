// script.js

// カードデッキを作成
const suits = ['♠', '♣', '♦', '♥'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];

// プレイヤーの手札
let player1Hand = [];
let player2Hand = [];
let player3Hand = [];
let player4Hand = [];

// 現在のターン（0: プレイヤー1, 1: AI1, 2: AI2, 3: AI3）
let currentPlayer = 0;
let discardPile = [];

// ルール設定
let ruleRevolution = false;
let rule8Cut = false;
let rule7Send = false;
let rule10Discard = false;

// ゲーム開始ボタン
document.getElementById('startBtn').addEventListener('click', startGame);

// ルール設定を取得
function getRules() {
  ruleRevolution = document.getElementById('ruleRevolution').checked;
  rule8Cut = document.getElementById('rule8Cut').checked;
  rule7Send = document.getElementById('rule7Send').checked;
  rule10Discard = document.getElementById('rule10Discard').checked;
}

// ゲーム開始時にデッキをシャッフルして、手札を配る
function startGame() {
  // ルール設定を取得
  getRules();

  // デッキ作成
  deck = createDeck();
  deck = shuffle(deck);

  // プレイヤーにカードを配る
  player1Hand = deck.slice(0, 5);
  player2Hand = deck.slice(5, 10);
  player3Hand = deck.slice(10, 15);
  player4Hand = deck.slice(15, 20);

  // 手札を表示
  displayHand('hand1', player1Hand);
  displayHand('hand2', player2Hand);
  displayHand('hand3', player3Hand);
  displayHand('hand4', player4Hand);

  discardPile = [];
  document.getElementById('pile').textContent = '';

  // 次のターンへ
  nextTurn();
}

// デッキを作成
function createDeck() {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push(value + suit);
    }
  }
  return deck;
}

// シャッフルする関数
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// 手札を画面に表示
function displayHand(player, hand) {
  const handDiv = document.getElementById(player);
  handDiv.innerHTML = '';
  hand.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.textContent = card;
    cardDiv.addEventListener('click', () => playCard(0, card)); // プレイヤー1は手動でカードを選択
    handDiv.appendChild(cardDiv);
  });
}

// ターン進行
function nextTurn() {
  setTimeout(() => {
    if (currentPlayer === 0) {
      // プレイヤー1 (人間のターン)
      alert('あなたの番です。カードを選んでください！');
    } else {
      // AIターン
      aiPlay(currentPlayer);
    }
  }, 500);
}

// AIがカードをプレイする
function aiPlay(playerNum) {
  let hand;
  switch (playerNum) {
    case 1: hand = player2Hand; break;
    case 2: hand = player3Hand; break;
    case 3: hand = player4Hand; break;
  }

  // AIは最小のカードをプレイする（簡単な戦略）
  let cardToPlay = hand[0]; // 最初のカード（簡単な戦略）
  playCard(playerNum, cardToPlay);
}

// カードをプレイする
function playCard(playerNum, card) {
  let hand;
  switch (playerNum) {
    case 0: hand = player1Hand; break;
    case 1: hand = player2Hand; break;
    case 2: hand = player3Hand; break;
    case 3: hand = player4Hand; break;
  }

  // プレイヤーの手札からカードを削除
  hand = hand.filter(c => c !== card);

  // 捨て札にカードを追加
  discardPile.push(card);
  document.getElementById('pile').textContent = card;

