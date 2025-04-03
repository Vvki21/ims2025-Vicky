/*
Particle Affection

Author: Meral Senturk inspired from Interactive logos

jasonlabbe3d.com
twitter.com/russetPotato
*/

const SPIN_MULTIPLIER = 45;
const MIN_PARTICLE_COUNT = 200;
const MAX_PARTICLE_COUNT = 700;
const MIN_FORCE = 0.4;
const MAX_FORCE = 0.6;
const REPULSION_RADIUS = 100;
const REPULSION_STRENGTH = 0.25;

const DrawTypes = {
    Ellipse: 0,
    Rect: 1,
    Triangle: 2,
};

let particles = [];
let particleCount = 550;
let drawType = DrawTypes.Ellipse;
let fullScreenBtn;

// 🎯 Dynamic values that grow in fullscreen
let minParticleSize = 12;
let maxParticleSize = 50;
let heartRadius = 200;
let spawnRadius = 200;

function setup() {
    createCanvas(windowWidth, windowHeight);
    spawnParticles();
    setupFullScreenBtn();
}

function draw() {
    background(255, 204, 0);

    textSize(16);
    fill(255);
    textAlign(LEFT);
//     text(
//         `
//         How to interact 
//         Move your mouse over the heart to interact.
        
//         Controls 
//         Left-click or spacebar: Change particle type
//         + : Increase particles
//         - : Decrease particles
//         `,
//         50, 50
//     );

    particles.forEach((particle) => {
        particle.move();
        particle.display();
    });
}

function spawnParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        const angle = random(TWO_PI);
        const radius = random(0.4, 1) * spawnRadius;
        const x = width / 2 + radius * cos(angle);
        const y = height / 2 - radius * sin(angle);
        particles.push(new Particle(createVector(x, y)));
    }
}

function mouseMoved() {
    particles.forEach((particle) => particle.reactToMouse(mouseX, mouseY));
}

function keyPressed() {
    if (key === '+') {
        particleCount = min(particleCount + 50, MAX_PARTICLE_COUNT);
        spawnParticles();
    } else if (key === '-') {
        particleCount = max(particleCount - 50, MIN_PARTICLE_COUNT);
        spawnParticles();
    } else if (key === ' ') {
        drawType = (drawType + 1) % Object.keys(DrawTypes).length;
    }
}

function mousePressed() {
    if (mouseButton === LEFT) {
        drawType = (drawType + 1) % Object.keys(DrawTypes).length;
    }
}

class Particle {
    constructor(pos) {
        this.pos = pos;
        this.vel = p5.Vector.random2D().mult(random(MIN_FORCE, MAX_FORCE));
        this.size = random(minParticleSize, maxParticleSize);
        this.color = color(random(200, 255), random(50, 100), random(150, 255), 150);
    }

    move() {
        this.pos.add(this.vel);

        const d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
        if (d > heartRadius) {
            this.vel.mult(-1); // bounce back
        }
    }

    reactToMouse(mx, my) {
        const d = dist(this.pos.x, this.pos.y, mx, my);
        if (d < REPULSION_RADIUS) {
            let force = p5.Vector.sub(this.pos, createVector(mx, my)).setMag(REPULSION_STRENGTH);
            this.vel.add(force);
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading() * SPIN_MULTIPLIER);
        fill(this.color);
        noStroke();

        switch (drawType) {
            case DrawTypes.Ellipse:
                ellipse(0, 0, this.size, this.size);
                break;
            case DrawTypes.Rect:
                rect(0, 0, this.size, this.size);
                break;
            case DrawTypes.Triangle:
                triangle(
                    -this.size * 0.5, -this.size * 0.5,
                    0, this.size,
                    this.size * 0.5, -this.size * 0.5
                );
                break;
        }
        pop();
    }
}

function setupFullScreenBtn() {
    fullScreenBtn = createButton('⛶ Full Screen');
    fullScreenBtn.position(20, 500);
    fullScreenBtn.style('font-size', '24px');
    fullScreenBtn.style('padding', '10px');
    fullScreenBtn.style('background-color', '#9ae6e6');
    fullScreenBtn.style('color', '#fff');
    fullScreenBtn.style('border', 'none');
    fullScreenBtn.style('cursor', 'pointer');
    fullScreenBtn.style('z-index', '9999');
    fullScreenBtn.style('position', 'absolute');

    fullScreenBtn.mousePressed(() => {
        fullScreenBtn.remove();
        fullscreen(true);

        setTimeout(() => {
            resizeCanvas(windowWidth, windowHeight);

            // 📈 Make everything bigger
            minParticleSize = 30;
            maxParticleSize = 90;
            heartRadius = 300;
            spawnRadius = 300;

            spawnParticles();
        }, 1000);
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    if (!fullscreen()) {
        minParticleSize = 12;
        maxParticleSize = 50;
        heartRadius = 200;
        spawnRadius = 200;
    }

    spawnParticles();
}
