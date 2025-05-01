//reference
//https://editor.p5js.org/ml5/sketches/ruoyal-RC
//https://editor.p5js.org/pattvira/sketches/b_iu4DTYf


let bodySegmentation;
let video;
let segmentation;

let fallingEmojis = [];
let landedEmojis = [];

let num = 50;
let defaultSize = 20;
let thresholdVal = 0.3;

let colWidth = 20;
let numCols;

function preload() {
  let options = {
    maskType: "parts"
  };
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  numCols = floor(width / colWidth);

  for (let i = 0; i < num; i++) {
    fallingEmojis.push(new Emoji());
  }
}

function draw() {
  background(255);
  image(video, 0, 0);

  // Update and display all landed emojis
  for (let emoji of landedEmojis) {
    emoji.update();
    emoji.display();
  }

  for (let emoji of fallingEmojis) {
    emoji.update();
    emoji.display();
  }
  //// Add a new emoji every few frames
  if (frameCount % 15 === 0) {
    fallingEmojis.push(new Emoji());
  }
}

function gotResults(result) {
  segmentation = result;
}

class Emoji {
  constructor() {
    this.emojis = ["🍏", "🍌", "🍒", "🥝", "🍓", "🍋", "🍔", "🍕", "🍣", "🍰", "🥨", "🥗", "🍧"];
    this.t = random(this.emojis);
    this.colIndex = floor(random(numCols));
    this.x = this.colIndex * colWidth + colWidth / 2;
    this.y = 0;
    this.dy = 3; // fall speed
    this.size = defaultSize;
    this.landed = false; //// whether the emoji has landed
  }

  update() {
    let isBody = false;

    if (segmentation && segmentation.mask) {
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

      segmentation.mask.loadPixels();
      let index = (int(videoY) * video.width + int(videoX)) * 4;
      let r = segmentation.mask.pixels[index];
      let g = segmentation.mask.pixels[index + 1];
      let b = segmentation.mask.pixels[index + 2];
      let a = segmentation.mask.pixels[index + 3];

      let notBody = (r > 240 && g > 240 && b > 240);
      isBody = a > 0 && !notBody;
    }

    if (isBody) {
      this.y -= this.dy;
      // if (random(1) < 0.3) this.t = random(this.emojis);

      // If it had landed, let it fall again
      if (this.landed) {
        this.landed = false;
        fallingEmojis.push(this);
        landedEmojis.splice(landedEmojis.indexOf(this), 1);
      }
    } else {
      if (!this.landed) {
        let stackTopY = getStackTop(this.colIndex);
        if (this.y + this.dy + this.size / 2 >= stackTopY) {
          // Stop at top of stack
          this.y = stackTopY - this.size / 2;
          this.landed = true;
          landedEmojis.push(this);
          fallingEmojis.splice(fallingEmojis.indexOf(this), 1);
        } else {
          this.y += this.dy;
        }
      }
    }

    this.y = constrain(this.y, 0, height);
  }

  display() {
    push();
    textAlign(CENTER, CENTER);
    textSize(this.size);
    text(this.t, this.x, this.y);
    pop();
  }
}
//Find the current top Y of the stack for a given column
function getStackTop(colIndex) {
  let xMin = colIndex * colWidth;
  let xMax = xMin + colWidth;
  let minY = height;

  for (let emoji of landedEmojis) {
    if (emoji.x >= xMin && emoji.x < xMax) {
      minY = min(minY, emoji.y - emoji.size / 2);
    }
  }

  return minY;
}
