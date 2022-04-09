class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };

    // Only when we press any key to move
    this.animate = animate;
    this.sprites = sprites;
  }

  // Draw method to render an image
  draw() {
    c.drawImage(
      this.image,
      this.frames.val * this.width, // This and below zero is for Crop starting point
      0,
      this.image.width / this.frames.max, // This and below is upto what it must be croped
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max, // Size of image
      this.image.height
    );

    // Moving Animation
    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed += 1;
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
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
    c.fillStyle = "rgba(255,0,0,0.5)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
