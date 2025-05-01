class Letter {
  constructor(x, y) {
    this.emojis = ["🍏", "🍌", "🍒", "🥝", "🍓", "🍋", "🍔", "🍕", "🍣", "🍰", "🥨", "🥗", "🍧"];
    this.t = random(this.emojis);
    this.x = x;
    this.y = y;
    this.dy = 2;
    this.size = defaultSize;
  }

  update(handDistance) {
    this.size = handDistance;

    let videoAspect = video.width / video.height;
    let canvasAspect = width / height;
    let drawW, drawH, offsetX, offsetY;

    if (videoAspect > canvasAspect) {
      drawW = width;
      drawH = width / videoAspect;
    } else {
      drawH = height;
      drawW = height * videoAspect;
    }

    offsetX = (width - drawW) / 2;
    offsetY = (height - drawH) / 2;

    let videoX = map(this.x, offsetX, offsetX + drawW, 0, video.width);
    let videoY = map(this.y, offsetY, offsetY + drawH, 0, video.height);

    videoX = constrain(videoX, 0, video.width - 1);
    videoY = constrain(videoY, 0, video.height - 1);

    if (segmentation && segmentation.mask) {
      segmentation.mask.loadPixels();
      let index = (int(videoY) * video.width + int(videoX)) * 4;
      let r = segmentation.mask.pixels[index];
      let g = segmentation.mask.pixels[index + 1];
      let b = segmentation.mask.pixels[index + 2];
      let a = segmentation.mask.pixels[index + 3];

      let notBody = (r > 240 && g > 240 && b > 240);
let isBody = a > 0 && !notBody;

      if (frameCount % 30 === 0) {
        console.log(
          `Letter at (${this.x.toFixed(1)}, ${this.y.toFixed(1)}), mapped to video (${int(videoX)}, ${int(videoY)}): r=${r}, g=${g}, b=${b}, a=${a}, isBody=${isBody}`
        );
      }

      if (isBody) {
        this.y -= this.dy;
        if (random(1) < 0.3) {
          this.t = random(this.emojis);
        }
      } else {
        this.y += this.dy;
      }

      // Debug: mark pixel on segmentation image
      this.debugX = map(videoX, 0, video.width, offsetX, offsetX + drawW);
      this.debugY = map(videoY, 0, video.height, offsetY, offsetY + drawH);
    } else {
      this.y += this.dy;
      this.debugX = null;
      this.debugY = null;
    }

    if (this.y >= height) {
      this.y = 1;
    }

    this.x = constrain(this.x, offsetX, offsetX + drawW);
    this.y = constrain(this.y, offsetY, offsetY + drawH);
  }

  display() {
    push();
    textSize(this.size);
    text(this.t, this.x, this.y);
    pop();

    // Draw a red dot where pixel is being checked in segmentation
    if (this.debugX !== null && this.debugY !== null) {
      push();
      fill(255, 0, 0);
      noStroke();
      // ellipse(this.debugX, this.debugY, 5, 5);
      pop();
    }
  }
}
