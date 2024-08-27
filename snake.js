const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
let score = 0;
let speed = 300;

const field = [];
const body = [];
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    field[i] = field[i] || [];
    field[i][j] = 0;
  }
}

function getRandomPosInField() {
  let x = Math.floor(Math.random() * field.length);
  let y = Math.floor(Math.random() * field[0].length);
  if (field[x][y] !== 0) {
    return getRandomPosInField();
  }
  return [x, y];
}

{
  const [startX, startY] = getRandomPosInField();
  field[startX][startY] = 2;
}

function getHeadPos() {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] === 2) {
        return [i, j];
      }
    }
  }
  throw new Error("Snake head could not be found");
}

{
  const [startFruitX, startFruitY] = getRandomPosInField();
  field[startFruitX][startFruitY] = 3;
}

function isFruitEaten() {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] === 3) {
        return false;
      }
    }
  }
  return true;
}

function draw() {
  const squareSize = canvas.width / field.length;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      switch (field[i][j]) {
        case 0:
          ctx.fillStyle = "black";
          break;
        case 1:
          ctx.fillStyle = "white";
          break;
        case 2:
          ctx.fillStyle = "green";
          break;
        case 3:
          ctx.fillStyle = "red";
          break;
      }
      ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
    }
  }
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function resizeAndDraw() {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  const canvasWidthHeight = width < height ? width : height;
  canvas.width = canvasWidthHeight;
  canvas.height = canvasWidthHeight;
  requestAnimationFrame(draw);
}
window.addEventListener("resize", resizeAndDraw);

resizeAndDraw();

let direction = "right";

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
    case "s":
      direction = "down";
      break;
    case "ArrowLeft":
    case "a":
      direction = "left";
      break;
    case "ArrowRight":
    case "d":
      direction = "right";
      break;
  }
});

function loop() {
  for (bodyPart of body) {
    const [x, y] = bodyPart;
    field[x][y] = 0;
  }

  const [headX, headY] = getHeadPos();
  try {
    switch (direction) {
      case "up":
        field[headX][headY - 1] = 2;
        field[headX][headY] = 0;
        break;
      case "down":
        field[headX][headY + 1] = 2;
        field[headX][headY] = 0;
        break;
      case "left":
        field[headX - 1][headY] = 2;
        field[headX][headY] = 0;
        break;
      case "right":
        field[headX + 1][headY] = 2;
        field[headX][headY] = 0;
        break;
    }
  } catch (e) {
    console.error(e);
    return;
  }

  for (let i = body.length - 1; i >= 0; i--) {
    if (i === 0) {
      body[i] = [headX, headY];
      continue;
    }
    body[i] = body[i - 1];
  }
  for (bodyPart of body) {
    const [x, y] = bodyPart;
    field[x][y] = 1;
  }

  if (isFruitEaten()) {
    body.push([headX, headY]);
    const [fruitX, fruitY] = getRandomPosInField();
    field[fruitX][fruitY] = 3;
    score++;
    speed = speed - speed * 0.03;
  }

  requestAnimationFrame(draw);
  setTimeout(loop, speed);
}

setTimeout(loop, speed);
