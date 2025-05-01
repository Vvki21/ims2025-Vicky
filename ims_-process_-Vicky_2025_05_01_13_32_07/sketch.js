let video;
let w = 640;
let h = 480;
let thresholdVal = 0.30;
let handpose;
let predictions = [];
let letters = [];
let num = 30;
let defaultSize = 20;
let fullscreenButton;


function setup() {
  createCanvas(w, h);
  video = createCapture(VIDEO);
  video.size(w, h);
  video.hide();
   filter(THRESHOLD);

  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', gotPredictions);

  let spacingFactor = 1;

  for (let i = 0; i < num; i++) {
    let x = (width / num) * i * spacingFactor;
    let y = 1;
    letters[i] = new Letter(x, y);
  }
  fullscreenButton = createButton('full screen');
  fullscreenButton.position(10, h + 10);
  fullscreenButton.mousePressed(toggleFullscreen);
}

function toggleFullscreen() {
  fullscreen(true);
  fullscreenButton.hide();
}

function windowResized() {
  if (fullscreen()) {
    resizeCanvas(windowWidth, windowHeight);
  } else {
    resizeCanvas(w, h);
  }
  letters = [];
  let spacingFactor = 1;
  for (let i = 0; i < num; i++) {
    let x = (width / num) * i * spacingFactor;
    let y = 1;
    letters[i] = new Letter(x, y);
  }
}


function modelReady() {
  console.log("Model Loaded!");
}

function gotPredictions(results) {
  predictions = results;
}

function draw() {
  background(0);
  let videoAspect = video.width / video.height;
  let canvasAspect = width / height;

  let drawW, drawH;
  
  if (videoAspect > canvasAspect) {
    drawW = width;
    drawH = width / videoAspect;
  } else {
    drawH = height;
    drawW = height * videoAspect;
  }

  let offsetX = (width - drawW) / 2;
  let offsetY = (height - drawH) / 2;

   // push();
  // translate(width, 0);
  // scale(-1, 1); 
  image(video, offsetX, offsetY, drawW, drawH);
  // pop();
   // filter(THRESHOLD, thresholdVal);
  // If hand is detected, calculate the distance
  let handDistance = defaultSize;  // Set to default size
  if (predictions.length > 0) {
    // Get the positions of thumb and index finger (index 4 and 8)
    let thumb = predictions[0].landmarks[4];  // Thumb tip
    let index = predictions[0].landmarks[8];  // Index tip

    // Calculate the distance between thumb and index finger
    handDistance = dist(thumb[0], thumb[1], index[0], index[1]);
    // Map the distance to a suitable range for emoji size
    handDistance = map(handDistance, 20, 150, 10, 50);  // Adjust 20-150 range based on hand size and distance
  }

  // Update and display emojis
  for (let i = 0; i < num; i++) {
    letters[i].update(handDistance);
    letters[i].display();
  }
}
function initLetters() {
  letters = [];


  let videoW = video.elt.videoWidth;
  let videoH = video.elt.videoHeight;
  let videoAspect = videoW / videoH;
  let canvasAspect = width / height;

  let drawW, drawH;
  if (videoAspect > canvasAspect) {
    drawW = width;
    drawH = width / videoAspect;
  } else {
    drawH = height;
    drawW = height * videoAspect;
  }

  let offsetX = (width - drawW) / 2;
  let offsetY = (height - drawH) / 2;

  for (let i = 0; i < num; i++) {
    let x = random(offsetX, offsetX + drawW);
    let y = random(offsetY, offsetY + drawH);
    letters[i] = new Letter(x, y, offsetX, offsetY, drawW, drawH); 
  }
}


