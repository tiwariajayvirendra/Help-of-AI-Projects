 // web.js

let dom_replay = document.querySelector("#replay");
let dom_score = document.querySelector("#score");
let dom_canvas = document.querySelector("#canvas");
let CTX = dom_canvas.getContext("2d");

const cells = 20;
let W, H, cellSize, snake, food, currentHue, isGameOver = false, tails = [], score = 0, maxScore = window.localStorage.getItem("maxScore"), particles = [], splashingParticleCount = 20, cellsCount, requestID;

let helpers = {
  vec: class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    mult(v) {
      if (v instanceof helpers.vec) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
      } else {
        this.x *= v;
        this.y *= v;
        return this;
      }
    }
  }
};

let KEY = {
  ArrowUp: false,
  ArrowRight: false,
  ArrowDown: false,
  ArrowLeft: false,
  resetState() {
    this.ArrowUp = false;
    this.ArrowRight = false;
    this.ArrowDown = false;
    this.ArrowLeft = false;
  },
  listen() {
    addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && this.ArrowDown) return;
      if (e.key === "ArrowRight" && this.ArrowLeft) return;
      if (e.key === "ArrowDown" && this.ArrowUp) return;
      if (e.key === "ArrowLeft" && this.ArrowRight) return;
      this[e.key] = true;
      Object.keys(this)
        .filter((f) => f !== e.key && f !== "listen" && f !== "resetState")
        .forEach((k) => {
          this[k] = false;
        });
    }, false);

    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      const centerX = W / 2;
      const centerY = H / 2;
      if (x < centerX && y < centerY) {
        this.ArrowUp = true;
      } else if (x > centerX && y < centerY) {
        this.ArrowRight = true;
      } else if (x < centerX && y > centerY) {
        this.ArrowLeft = true;
      } else if (x > centerX && y > centerY) {
        this.ArrowDown = true;
      }
    });
  }
};

class Snake {
  constructor(i, type) {
    this.pos = new helpers.vec(W / 2, H / 2);
    this.dir = new helpers.vec(0, 0);
    this.type = type;
    this.index = i;
    this.delay = 5;
    this.size = cellSize;
    this.color = "Green";
    this.history = [];
    this.total = 1;
  }
  draw() {
    let { x, y } = this.pos;
    CTX.fillStyle = this.color;
    CTX.shadowBlur = 20;
    CTX.shadowColor = "rgba(255, 255, 255, .3)";
    CTX.fillRect(x, y, this.size, this.size);
    CTX.shadowBlur = 0;
    if (this.total >= 2) {
      for (let i = 0; i < this.history.length - 1; i++) {
        let { x, y } = this.history[i];
        CTX.lineWidth = 1;
        CTX.fillStyle = "rgba(255, 255, 255, .1)";
        CTX.fillRect(x, y, this.size, this.size);
      }
    }
  }
  walls() {
    let { x, y } = this.pos;
    if (x + cellSize > W) {
      this.pos.x = 0;
    }
    if (y + cellSize > H) {
      this.pos.y = 0;
    }
    if (y < 0) {
      this.pos.y = H - cellSize;
    }
    if (x < 0) {
      this.pos.x = W - cellSize;
    }
  }
  controlls() {
    let dir = this.size;
    if (KEY.ArrowUp) {
      this.dir = new helpers.vec(0, -dir);
    }
    if (KEY.ArrowDown) {
      this.dir = new helpers.vec(0, dir);
    }
    if (KEY.ArrowLeft) {
      this.dir = new helpers.vec (-dir, 0);
    }
    if (KEY.ArrowRight) {
      this.dir = new helpers.vec(dir, 0);
    }
  }
  update() {
    this.pos.add(this.dir);
    this.walls();
    this.history.push(new helpers.vec(this.pos.x, this.pos.y));
    if (this.history.length > this.total) {
      this.history.shift();
    }
  }
}

class Food {
  constructor() {
    this.pos = new helpers.vec(
      Math.floor(Math.random() * cells) * cellSize,
      Math.floor(Math.random() * cells) * cellSize
    );
    this.size = cellSize;
    this.color = "Blue";
  }
  draw() {
    let { x, y } = this.pos;
    CTX.fillStyle = this.color;
    CTX.fillRect(x, y, this.size, this.size);
  }
}

class Particle {
  constructor(x, y, hue) {
    this.pos = new helpers.vec(x, y);
    this.size = cellSize / 2;
    this.color = `hsl(${hue}, 100%, 50%)`;
    this.delay = 5;
    this.total = 10;
    this.history = [];
  }
  draw() {
    let { x, y } = this.pos;
    CTX.fillStyle = this.color;
    CTX.fillRect(x, y, this.size, this.size);
    if (this.total >= 2) {
      for (let i = 0; i < this.history.length - 1; i++) {
        let { x, y } = this.history[i];
        CTX.lineWidth = 1;
        CTX.fillStyle = "rgba(255, 255, 255, .1)";
        CTX.fillRect(x, y, this.size, this.size);
      }
    }
  }
  update() {
    this.pos.y -= this.size;
    this.history.push(new helpers.vec(this.pos.x, this.pos.y));
    if (this.history.length > this.total) {
      this.history.shift();
    }
  }
}

function initialize() {
  W = dom_canvas.width = window.innerWidth;
  H = dom_canvas.height = window.innerHeight;
  cellSize = W / cells;
  CTX.imageSmoothingEnabled = false;
  KEY.listen();
  snake = new Snake(0, "snake");
  food = new Food();
  currentHue = Math.floor(Math.random() * 360);
  requestID = requestAnimationFrame(update);
}

function update() {
  CTX.clearRect(0, 0, W, H);
  snake.controlls();
  snake.update();
  food.draw();
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  if (snake.pos.x === food.pos.x && snake.pos.y === food.pos.y) {
    score++;
    dom_score.textContent = `Score: ${score}`;
    if (score > maxScore) {
      maxScore = score;
      window.localStorage.setItem("maxScore", maxScore);
    }
    for (let i = 0; i < splashingParticleCount; i++) {
      particles.push(new Particle(snake.pos.x, snake.pos.y, currentHue));
    }
    food = new Food();
  }
  for (let i = 0; i < snake.history.length; i++) {
    if (snake.pos.x === snake.history[i].x && snake.pos.y === snake.history[i].y) {
      isGameOver = true;
    }
  }
  if (isGameOver) {
    cancelAnimationFrame(requestID);
    dom_replay.textContent = "Game Over! Click to replay";
  } else {
    requestID = requestAnimationFrame(update);
  }
}

dom_replay.addEventListener("click", () => {
  isGameOver = false;
  score = 0;
  dom_score.textContent = `Score: ${score}`;
  particles = [];
  snake = new Snake(0, "snake");
  food = new Food();
  requestID = requestAnimationFrame(update);
});

initialize();
