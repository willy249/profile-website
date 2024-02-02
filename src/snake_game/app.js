import "./styles/style.css";

const canvas = document.getElementById("myCanvas");
// canvas原生 getContext() method 會回傳一個canvas的drawing context
// drawing context可以用來在canvas內畫圖
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

// 蛇身初始位置
let snake = [];

snake[0] = {
  x: 80,
  y: 0,
};

snake[1] = {
  x: 60,
  y: 0,
};

snake[2] = {
  x: 40,
  y: 0,
};

snake[3] = {
  x: 20,
  y: 0,
};

// 果實
class fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  // 繪製果實
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  // 重新計算果實位置
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }
    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y); // 確認新座標是否重疊
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}
let myFruit = new fruit();

// 分數
let score = 0;
let highestScore;
loadHighestScore();
document.getElementById("myScore").innerText = `遊戲分數: ${score}`;
document.getElementById("myScore2").innerText = `最高分數: ${highestScore}`;

// 方向監聽器
let snakeHeadDirection = "Right";
let gamePaused = false;
window.addEventListener("keydown", changeDirection);
function changeDirection(e) {
  // 暫停遊戲
  if (e.key === " ") {
    gamePaused = !gamePaused;
    if (gamePaused) {
      clearInterval(myGame);
      document.getElementById("gameStatus").innerText = "遊戲暫停";
      return;
    } else {
      myGame = setInterval(draw, delay);
      document.getElementById("gameStatus").innerText = "";
    }
  }

  if (!gamePaused) {
    let key = e.key.toLowerCase();
    if ((e.key == "ArrowRight" || key == "d") && snakeHeadDirection != "Left") {
      snakeHeadDirection = "Right";
    } else if (
      (e.key == "ArrowDown" || key == "s") &&
      snakeHeadDirection != "Up"
    ) {
      snakeHeadDirection = "Down";
    } else if (
      (e.key == "ArrowLeft" || key == "a") &&
      snakeHeadDirection != "Right"
    ) {
      snakeHeadDirection = "Left";
    } else if (
      (e.key == "ArrowUp" || key == "w") &&
      snakeHeadDirection != "Down"
    ) {
      snakeHeadDirection = "Up";
    }

    // 每一次按下上下左右鍵之後，再下一幀被畫出來之前，
    // 不接受任何keydown 事件
    // 這樣可以防止連續按鍵導致蛇在邏輯上自殺
    window.removeEventListener("keydown", changeDirection);
  }
}

function draw() {
  // 每次繪製前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }

  // 清除畫布，用於清除原先所繪製的設置
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 果實繪製
  myFruit.drawFruit();

  // 蛇身繪製
  for (let i = 0; i < snake.length; i++) {
    // 凸顯蛇頭-顏色
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    // 繪製前，先確認前一幀所計算 蛇的位置 是否超過 canvas 畫布
    // 超過的話，實現穿牆
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y >= canvas.width) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // 繪製實心方塊 x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    // 繪製方塊的邊框 x, y, width, height
    ctx.strokeStyle = "white";
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 實現移動
  // 以目前蛇頭方向，來決定蛇的下一幀位置
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (snakeHeadDirection == "Left") {
    snakeX -= unit;
  } else if (snakeHeadDirection == "Up") {
    snakeY -= unit;
  } else if (snakeHeadDirection == "Down") {
    snakeY += unit;
  } else if (snakeHeadDirection == "Right") {
    snakeX += unit;
  }
  // 設置新蛇頭位置
  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  // 確認蛇是否吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation(); // 重新選定果實位置
    // 更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerText = `遊戲分數: ${score}`;
    document.getElementById("myScore2").innerText = `最高分數: ${highestScore}`;
  } else {
    snake.pop(); // 若沒吃到，則移除蛇尾，確保蛇身長度不變
  }

  snake.unshift(newHead); //新增蛇頭
  window.addEventListener("keydown", changeDirection); // 繪製完成後，重新添加方向監聽器
}
let delay = 150;
let myGame = setInterval(draw, delay);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
