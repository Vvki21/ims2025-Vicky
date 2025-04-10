let handPose;
let myVideo;
let myResults;
let starColor;
let fullScreenBtn;

let minStarSize = 20;
let maxStarSize = 100;
let isFullscreenMode = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  myVideo = createCapture(VIDEO);
  myVideo.size(640, 480); 
  myVideo.hide();

  handPose = ml5.handpose();
  handPose.detectStart(myVideo, gotResults);

  stroke(0);
  fill(255, 255, 0);
  strokeWeight(5);

  //add url
  let params = getURLParams();
  starColor = params.star || 'yellow';

  setupFullScreenBtn(); // full screen button
}

function gotResults(results) {
  myResults = results;
}

function draw() {
  background(0);

  let videoAspect = myVideo.width / myVideo.height;
  let canvasAspect = width / height;
  let drawW, drawH;

  if (videoAspect > canvasAspect) {
    drawW = width;
    drawH = width / videoAspect;
  } else {
    drawH = height;
    drawW = height * videoAspect;
  }

 push();
 translate(width, 0); // right flip
 scale(-1, 1); // horizontal flip

 image(myVideo, (width - drawW) / 2, (height - drawH) / 2,  drawW, drawH);

 pop();

  if (myResults && myResults.length >= 2) {
    drawLines();
  }
  
  if (!myResults || myResults.length < 2) {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Please place both hands in front of the camera", width / 2, height / 2);
  } else {
    drawLines();
  }
}

function drawLines() {
  const leftHand = myResults[0];
  const rightHand = myResults[1];

  if (!leftHand || !rightHand) return;

  // keep the original position
  const scaleX = width / myVideo.width;
  const scaleY = height / myVideo.height;

 const leftIndexTip = {
  x: width - leftHand.index_finger_tip.x * scaleX,
  y: leftHand.index_finger_tip.y * scaleY,
};

const rightIndexTip = {
  x: width - rightHand.index_finger_tip.x * scaleX,
  y: rightHand.index_finger_tip.y * scaleY,
};


  const distance = dist(leftIndexTip.x, leftIndexTip.y, rightIndexTip.x, rightIndexTip.y);

  if (distance < 50) {
    textSize(24);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Keep two hands away from each other", width / 2, height / 2);
  } else {
    noStroke();
    fill(starColor); // get star color

    const midX = (leftIndexTip.x + rightIndexTip.x) / 2;
    const midY = (leftIndexTip.y + rightIndexTip.y) / 2;

    const starSize = map(distance, 50, 200, minStarSize, maxStarSize);
    drawStar(midX, midY, starSize, 5);
  }
}

function drawStar(x, y, radius, npoints) {
  const angle = TWO_PI / npoints;
  const halfAngle = angle / 2;
  beginShape();
  for (let a = -PI / 10; a < TWO_PI; a += angle) {
    const sx = x + cos(a) * radius;
    const sy = y + sin(a) * radius;
    vertex(sx, sy);
    const sx2 = x + cos(a + halfAngle) * (radius / 2);
    const sy2 = y + sin(a + halfAngle) * (radius / 2);
    vertex(sx2, sy2);
  }
  endShape(CLOSE);
}

// function setupFullScreenBtn() {
//   fullScreenBtn = createButton('⛶ Full Screen');
//   fullScreenBtn.position(20, 550);
//   fullScreenBtn.style('font-size', '24px');
//   fullScreenBtn.style('padding', '10px');
//   fullScreenBtn.style('background-color', '#9ae6e6');
//   fullScreenBtn.style('color', '#fff');
//   fullScreenBtn.style('border', 'none');
//   fullScreenBtn.style('cursor', 'pointer');
//   fullScreenBtn.style('z-index', '9999');
//   fullScreenBtn.style('position', 'absolute');

  fullScreenBtn.mousePressed(() => {
    fullScreenBtn.remove();
    fullscreen(true);

    setTimeout(() => {
      resizeCanvas(windowWidth, windowHeight);
      isFullscreenMode = true;

      minStarSize = 40;
      maxStarSize = 150;
    }, 1000);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
