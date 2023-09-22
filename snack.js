let h = 30;
let w = 30;
let tickInterval = 0.5;

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
    // generate a new food
    const range = h * w - snack.length();
    if (range > (h * w) / 2) {
      // not reach half of the board
      const randomX = Math.floor(Math.random() * w);
      const randomY = Math.floor(Math.random() * h);
      // check if the point is occupied by snack
      if (snack.isOccupied(new Point(randomX, randomY))) {
        refresh();
      } else {
        this.point = new Point(randomX, randomY);
        return;
      }
    } else {
      const randomIndex = Math.floor(Math.random() * range);
      const startFromEnd = randomIndex > availableSpaces / 2;
      let counter = 0;
      if (startFromEnd) {
        for (let y = height - 1; y >= 0; y--) {
          for (let x = width - 1; x >= 0; x--) {
            if (!snack.isOccupied(new Point(x, y))) {
              counter++;
              if (counter === availableSpaces - random) {
                this.point = new Point(x, y);
                return;
              }
            }
          }
        }
      } else {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            if (!snack.isOccupied(new Point(x, y))) {
              counter++;
              if (counter === random) {
                this.point = new Point(x, y);
                return;
              }
            }
          }
        }
      }
    }
  }
}

class Snack {
  constructor() {
    this.direction = Direction.DOWN;
    this.list = [];
    this.list.push(new Point(0, 2));
    this.list.push(new Point(0, 1));
    this.list.push(new Point(0, 0));
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
    // check game over
    const headNextPoint = this.getHeadNextPoint();
    if (headNextPoint.x < 0 || headNextPoint.x >= w) {
      console.log("game over1");
      return;
    }
    if (headNextPoint.y < 0 || headNextPoint.y >= h) {
      console.log("game over2");
      return;
    }
    if (this.isOccupied(headNextPoint)) {
      console.log("game over3");
      return;
    }
    this.pop();
    this.unshift(this.getHeadNextPoint());
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

  gotFood() {
    const headNextPoint = this.getHeadNextPoint();
    return (headNextPoint.x = food.point.x && headNextPoint.y === food.point.y);
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
});

// start
setInterval(() => {
  tick();
  render();
}, tickInterval * 1000);
