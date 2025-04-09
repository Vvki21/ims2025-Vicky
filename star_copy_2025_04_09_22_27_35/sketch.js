let handPose;
let myVideo;
let myResults;
let starColor;

function setup() {
  createCanvas(640, 480);
  myVideo = createCapture(VIDEO);
  myVideo.size(width, height);
  myVideo.hide();
  
  handPose = ml5.handpose();
  handPose.detectStart(myVideo, gotResults);
  
  stroke(255,0,0);
  fill(255,255,0);
  strokeWeight(5);
  
  let params = getURLParams();
  starColor = params.star || 'yellow';
}

function gotResults(results) {
  console.log(results);
  myResults = results;
}

function draw() {
  image(myVideo, 0, 0, width, height);
  
  if (myResults) {
    drawLines();
  }
}

let starSize = 20; 

function drawLines() {
  const leftHand = myResults[0];
  const rightHand = myResults[1];

  if (!leftHand || !rightHand) {
    return;
  }

  const leftIndexTip = leftHand.index_finger_tip;
  const rightIndexTip = rightHand.index_finger_tip;


  const distance = dist(leftIndexTip.x, leftIndexTip.y, rightIndexTip.x, rightIndexTip.y);

  if (distance < 50) {
    textSize(24); 
    fill(255); 
    textAlign(CENTER, CENTER); 
    text("Keep two fingers away from each other", width / 2, height / 2); 
  } else {
    noStroke();
    fill(starColor);//url

    const midX = (leftIndexTip.x + rightIndexTip.x) / 2;
    const midY = (leftIndexTip.y + rightIndexTip.y) / 2;


    const starSize = map(distance, 50, 200, 10, 100);

    drawStar(midX, midY, starSize, 5);
  }
}

function drawStar(x, y, radius, npoints) {
  const angle = TWO_PI / npoints;
  const halfAngle = angle / 2;
  beginShape();
  for (let a = -PI/10; a < TWO_PI; a += angle) {
    const sx = x + cos(a) * radius;
    const sy = y + sin(a) * radius;
    vertex(sx, sy);
    const sx2 = x + cos(a + halfAngle) * (radius / 2);
    const sy2 = y + sin(a + halfAngle) * (radius / 2);
    vertex(sx2, sy2);
  }
  endShape(CLOSE);
}