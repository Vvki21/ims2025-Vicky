class Letter {
  constructor(x, y) {
    this.emojis = ["🍏", "🍌", "🍒", "🥝", "🍓", "🍋", "🍔", "🍕", "🍣", "🍰", "🥨", "🥗", "🍧"];
    this.t = random(this.emojis);  // random emoji
    this.x = x;
    this.y = y;
    this.dy = 2;
    this.size = defaultSize;  // Default size
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

  let color = video.get(videoX, videoY);
  let b = brightness(color);


if (b > thresholdVal * 225) {
  this.y += this.dy;
} else {
  if (this.y > offsetY && b < thresholdVal * 225) {
    this.y -= this.dy;
    if (random(1) < 0.3) {
      this.t = random(this.emojis);
    }
  }
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
}
}