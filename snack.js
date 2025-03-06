let h = 30;
let w = 30;
let tickInterval = 0.5;
let canChangeDirection = true;

const Direction = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Food {
  constructor() {
    this.refresh();
  }

  refresh() {
    const availableSpaces = h * w - snack.length();
    const randomIndex = Math.floor(Math.random() * availableSpaces);
    let counter = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!snack.isOccupied(new Point(x, y))) {
          if (counter === randomIndex) {
            this.point = new Point(x, y);
            return;
          }
          counter++;
        }
      }
    }
  }
}

class Snack {
  constructor() {
    this.direction = Direction.DOWN;
    this.list = [new Point(0, 2), new Point(0, 1), new Point(0, 0)];
  }

  pop() {
    return this.list.pop();
  }

  unshift(p) {
    return this.list.unshift(p);
  }

  length() {
    return this.list.length;
  }

  feed(food) {
    this.unshift(food.point);
    food.refresh();
  }

  move() {
    const headNextPoint = this.getHeadNextPoint();
    if (this.isOutOfBounds(headNextPoint) || this.isOccupied(headNextPoint)) {
      console.log("game over");
      return;
    }
    this.pop();
    this.unshift(headNextPoint);
  }

  getHeadNextPoint() {
    const headPoint = this.list[0];
    switch (this.direction) {
      case Direction.UP:
        return new Point(headPoint.x, headPoint.y - 1);
      case Direction.DOWN:
        return new Point(headPoint.x, headPoint.y + 1);
      case Direction.LEFT:
        return new Point(headPoint.x - 1, headPoint.y);
      case Direction.RIGHT:
        return new Point(headPoint.x + 1, headPoint.y);
    }
  }

  isOutOfBounds(point) {
    return point.x < 0 || point.x >= w || point.y < 0 || point.y >= h;
  }

  gotFood() {
    const headNextPoint = this.getHeadNextPoint();
    return headNextPoint.x === food.point.x && headNextPoint.y === food.point.y;
  }

  isOccupied(point) {
    return this.list.some((p) => p.x === point.x && p.y === point.y);
  }
}

let snack = new Snack();
let food = new Food();

const tick = () => {
  if (snack.gotFood()) {
    snack.feed(food);
  } else {
    snack.move();
  }
};

// display
const table = document.getElementById("app");
const render = () => {
  table.innerHTML = "";
  for (let y = 0; y < h; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < w; x++) {
      const cell = document.createElement("td");
      if (snack.isOccupied(new Point(x, y))) {
        cell.className = "snack";
      }
      if (food.point.x === x && food.point.y === y) {
        cell.className = "food";
      }
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
};

// control
document.addEventListener("keydown", (event) => {
  if (!canChangeDirection) return;
  switch (event.key) {
    case "ArrowUp":
      if (snack.direction !== Direction.DOWN) snack.direction = Direction.UP;
      break;
    case "ArrowDown":
      if (snack.direction !== Direction.UP) snack.direction = Direction.DOWN;
      break;
    case "ArrowLeft":
      if (snack.direction !== Direction.RIGHT) snack.direction = Direction.LEFT;
      break;
    case "ArrowRight":
      if (snack.direction !== Direction.LEFT) snack.direction = Direction.RIGHT;
      break;
  }
  canChangeDirection = false;
});

// start
setInterval(() => {
  tick();
  render();
  canChangeDirection = true;
}, tickInterval * 1000);
