// Declare some color constants
const colors = {
  red: "#BF616A",
  orange: "#D08770",
  yellow: "#EBCB8B",
  green: "#A3BE8C",
  blue: "#5E81AC",
  purple: "#B48EAD",
  background: "#2E3440",
  foreground: "#ECEFF4",
};

// Declare sprite variables
let walls;
let player, enemies, food, friends;

// Initialize some params
let startingMass = 2;
let numEnemies = 10;
let drag = 0.1;
let impulse = 0.2;
let foodSize = 15;
let playerSize = 20;

let maxFood = 30;

let foodChance = 0.02;
let sizeThreshold = 5;

const gameOverMessage = "Oh dear, you are dead!";
let gameOver = false;
let finalScore = 0;

let scoreSize = 32;

function setup() {
  new Canvas(windowWidth, windowHeight);
  noStroke();
  setupBounds();
  setupPlayer();
  setupFriends();
  setupFood();
  setupEnemies();

  player.overlapping(enemies, siphon);
  enemies.overlapping(enemies, siphon);

  player.overlapping(food, eat);
  enemies.overlapping(food, eat);
}

function draw() {
  // Turning off the background has a fun effect!
  background(colors.background);
  handlePlayerMove();
  handleEnemyMove();

  if (food.length < maxFood) {
    if (random() < foodChance) new food.Sprite();
  }

  drawScore();
}

function drawScore() {
  textAlign(RIGHT, TOP);
  textSize(scoreSize);
  let wordWidth = textWidth(finalScore);
  fill(colors.purple);
  rectMode(CORNERS);
  rect(width, 0, width - wordWidth - 20, scoreSize + 20, 20);
  fill(colors.foreground);
  text(finalScore, width - 10, 10);
}

function endGame() {
  // let message1 = `Oh dear, you are dead!`;
  let scoreMessage = `Final score: ${finalScore}`;
  let messageWidth = textWidth(scoreMessage);

  // Draw background rect
  fill(colors.purple);
  rectMode(CENTER);
  rect(width / 2, height / 2, messageWidth + 20, scoreSize + 20, 20);

  // Draw Text
  textAlign(CENTER, BOTTOM);
  textSize(scoreSize);
  fill(colors.foreground);
  text(scoreMessage, width / 2, height / 2);

  // Stop game
  gameOver = true;
  noLoop();
}

function restart() {
  gameOver = false;
  finalScore = 0;
  // need to remake player sprite?
  // start loop again
}

function handleEnemyMove() {
  let positions = [];
  for (const [i, enemy] of enemies.entries()) {
    positions.push({ index: i, d: enemy.d });
  }

  let sorted = positions.sort((a, b) => (a.d > b.d ? 1 : -1));

  for (const enemy of enemies) {
    let target = enemy;

    for (const [i, entry] of sorted.entries()) {
      if (enemy.d > entry.d) {
        target = enemies[sorted[i].index];
      } else {
        break;
      }
    }
    enemy.moveTowards(target, 0.001);
  }
}

function updateScore(newScore) {
  if (newScore > finalScore) finalScore = Math.ceil(newScore);
}

function siphon(good, evil) {
  if (good.d > evil.d) {
    good.d += 0.5;
    evil.d -= 0.5;
    if (good.idNum === player.idNum) updateScore(good.d);
  } else {
    good.d -= 0.5;
    evil.d += 0.5;
    if (evil.idNum === player.idNum) updateScore(evil.d);
  }

  if (good.d < sizeThreshold) {
    if (good.idNum === player.idNum) endGame();
    good.remove();
  }
  if (evil.d < sizeThreshold) {
    if (evil.idNum === player.idNum) endGame();
    evil.remove();
  }
}

function eat(spr, food) {
  spr.d += 0.5;
  food.d -= 0.5;

  if (spr.idNum === player.idNum) updateScore(spr.d);

  if (food.d < sizeThreshold) food.remove();
}

function handlePlayerMove() {
  player.speed -= drag;

  if (kb.pressing("up") || kb.pressing("w")) {
    player.vel.y -= impulse;
  } else if (kb.pressing("down") || kb.pressing("s")) {
    player.vel.y += impulse;
  } else if (kb.pressing("left") || kb.pressing("a")) {
    player.vel.x -= impulse;
  } else if (kb.pressing("right") || kb.pressing("d")) {
    player.vel.x += impulse;
  }
}

function setupBounds() {
  walls = new Sprite(
    [
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
      [0, 1],
    ],
    "static"
  );

  walls.color = colors.background;
}

function setupPlayer() {
  player = new Sprite();
  player.color = colors.yellow;
  player.d = playerSize;
  player.bounciness = 1;
  finalScore = player.d;
}

function setupFood() {
  food = new Group();
  food.color = colors.green;
  food.d = foodSize;
  food.x = () => random(0, width - foodSize);
  food.y = () => random(0, height - foodSize);
  food.amount = maxFood;
}

function setupFriends() {
  friends = new Group();
  friends.amount = numEnemies;
  friends.color = colors.blue;
  friends.d = () => random(20, 100);
  friends.x = (index) => random(0, width - friends[index].d);
  friends.y = (index) => random(0, height - friends[index].d);
  friends.bounciness = 1;
}

function setupEnemies() {
  enemies = new Group();
  enemies.amount = numEnemies;
  enemies.color = colors.red;
  enemies.d = () => random(20, 100);
  enemies.x = (index) => random(0, width - enemies[index].d);
  enemies.y = (index) => random(0, height - enemies[index].d);
  enemies.bounciness = 1;
}
