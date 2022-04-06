const canvas = document.querySelector("canvas");

// Here c is context
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

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
  constructor({ position, velocity, image }) {
    this.position = position;
    this.image = image;
  }

  // Draw method to render an image
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const background = new Sprite({
  position: {
    x: -710,
    y: -580,
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

function animateCharacter() {
  window.requestAnimationFrame(animateCharacter);
  background.draw();
  c.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 80,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  );

  // Moves Up
  if (keys.w.pressed) background.position.y += 3;
  // Moves Left
  else if (keys.a.pressed) background.position.x += 3;
}

animateCharacter();

// Moving player when user presses the key
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      break;
    case "s":
      keys.s.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      console.log("pressed Left");
      break;
    case "d":
      keys.d.pressed = true;
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
