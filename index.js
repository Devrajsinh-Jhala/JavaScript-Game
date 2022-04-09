const canvas = document.querySelector("canvas");

// Here c is context
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

// Battle Zone Map Creation
const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}

// console.log(battleZonesData);

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

// Battle Zones Map creation
const battleZones = [];
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(
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

// console.log(battleZones);

// Inserting the map
// You can't just pass the path as string in draw image, hence we first create an object for the image.

const image = new Image();
image.src = "./Map and Game Assets/Pellet Town.png";

const foregroundImage = new Image();
foregroundImage.src = "./Map and Game Assets/Foreground Objects.png";
// Player Image -> same as that we did with map one.

const playerImage = new Image();
playerImage.src = "./Map and Game Assets/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./Map and Game Assets/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./Map and Game Assets/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./Map and Game Assets/playerRight.png";

// Animation for the character movement whenever keys are pressed
// class to make code cleaner

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 80, // Location of image,
    y: canvas.height / 2 - 68 / 28,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    down: playerImage,
    right: playerRightImage,
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

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
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
const movables = [background, ...boundaries, foreground, ...battleZones];

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

  // Rendering Battle Zones
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });

  player.draw();
  foreground.draw();

  // Battle Activation
  if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      // Detecting for Collisions
      const battleZone = battleZones[i];

      // If player is at corners battle must not get initiated
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("Battle Zone Collision");
        break;
      }
    }
  }

  let Moving = true;
  player.moving = false;
  // Moves Up
  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.image = player.sprites.up;
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
    player.moving = true;
    player.image = player.sprites.left;
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
    player.moving = true;
    player.image = player.sprites.down;
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
    player.moving = true;
    player.image = player.sprites.right;
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
  // console.log(keys);
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
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
  // console.log(keys);
});
