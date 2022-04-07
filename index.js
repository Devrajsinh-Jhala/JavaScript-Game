const canvas = document.querySelector("canvas");

// Here c is context
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255,0,0,0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
const offset = {
  x: -710,
  y: -580,
};
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

console.log(boundaries);

// Inserting the map
// You can't just pass the path as string in draw image, hence we first create an object for the image.

const image = new Image();
image.src = "./Map and Game Assets/Pellet Town.png";
// Player Image -> same as that we did with map one.

const playerImage = new Image();
playerImage.src = "./Map and Game Assets/playerDown.png";

// Animation for the character movement whenever keys are pressed
// class to make code cleaner
class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  // Draw method to render an image
  draw() {
    c.drawImage(
      this.image,
      0, // This and below zero is for Crop starting point
      0,
      this.image.width / this.frames.max, // This and below is upto what it must be croped
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max, // Size of image
      this.image.height
    );
  }
}

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 80, // Location of image,
    y: canvas.height / 2 - 68 / 28,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});
// canvas.width / 2 - this.image.width / 80, // Location of image
// canvas.height / 2 - this.image.height / 2,

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: {
    pressed: false,
  },

  s: {
    pressed: false,
  },

  a: {
    pressed: false,
  },

  d: {
    pressed: false,
  },
};

// Instead of writing testBoundarys and background we define a array to make code clean
const movables = [background, ...boundaries];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function animateCharacter() {
  window.requestAnimationFrame(animateCharacter);
  background.draw();
  // Drawing Boudaries
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  player.draw();

  let Moving = true;
  // Moves Up
  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      // Detecting for Collisions
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log("collision");
        Moving = false;
        break;
      }
    }

    if (Moving) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
  }
  // Moves Left
  else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      // Detecting for Collisions
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("collision");
        Moving = false;
        break;
      }
    }

    if (Moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  }
  // Moves Down
  else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      // Detecting for Collisions
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log("collision");
        Moving = false;
        break;
      }
    }

    if (Moving)
      movables.forEach((movable) => {
        for (let i = 0; i < boundaries.length; i++) {
          // Detecting for Collisions
          const boundary = boundaries[i];
          if (
            rectangularCollision({
              rectangle1: player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x - 3,
                  y: boundary.position.y,
                },
              },
            })
          ) {
            console.log("collision");
            Moving = false;
            break;
          }
        }

        if (Moving) movable.position.y -= 3;
      });
  }
  // Moves Right
  else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      // Detecting for Collisions
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("collision");
        Moving = false;
        break;
      }
    }

    if (Moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
}

animateCharacter();

// Moving player when user presses the key
// Listening for the last key pressed
let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
  console.log(keys);
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      console.log("pressed Left");
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
  console.log(keys);
});
