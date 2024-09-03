// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    // debugTools();
    textFont("Arial");
    // noinspection JSUnresolvedFunction
    rectMode(CENTER)
    textSize(24);
    background("#fff")

    water_circles(words, vocal, drum, bass, other)
}

let particles = [];
let attractionForceSlider;
let sizeSlider;
let tensionSlider;
let frictionSlider;

/* runs after system_runner.js:setup() */
function setup_() {
    // noinspection JSUnresolvedFunction
    attractionForceSlider = createSlider(0, 1, 0.05, 0.001);
    select("#attraction-force").child(attractionForceSlider);
    // noinspection JSUnresolvedFunction
    sizeSlider = createSlider(1, 50, 20, 1);
    select("#size").child(sizeSlider);
    // noinspection JSUnresolvedFunction
    tensionSlider = createSlider(0, 2, 0.5, 0.05);
    select("#tension").child(tensionSlider);
    // noinspection JSUnresolvedFunction
    frictionSlider = createSlider(0, 1, 0, 0.05);
    select("#friction").child(frictionSlider);

    for (let i = 0; i < 250; i++) {
        particles.push(new Particle());
    }

    // noinspection JSUnresolvedFunction
    noStroke();
}

const colours = ["#ffcbf2", "#d0d1ff", "#c0fdff", "#d0d1ff"];

let pSize, pSize_ = 50; // weird workaround
let repulsionForce = 0.5;
let friction = 0.9;
let attractionForce = 0.1;
let attractionDistance = 2;
let repulsionDistance = 1;
let maxVel = 5;
let maxForce = 1;
let particleScaleBy = 0;
let volumeRandomiser = rand(1, 4);

// Derived quantities
let attraction2
let repulsion2
let vel2 = Math.pow(maxVel, 2);
let force2 = Math.pow(maxForce, 2);

let circle_;
let circles;
let boundaryCircle = rand(1, 3)
const largestCircle = 500;
const circleStepSize = 100;

function water_circles(words, vocal, drum, bass, other) {

    console.log(
        // "Four colours: " + fourColours +
        "\nGravity: " + attractionForceSlider.value() +
        "\nSize: " + pSize +
        "\nRepulsion: " + tensionSlider.value() +
        "\nFriction: " + frictionSlider.value()
    )

    particleScaleBy = volumeRandomiser === 1 ? vocal :
        volumeRandomiser === 2 ? drum :
            volumeRandomiser === 3 ? bass :
                volumeRandomiser === 4 ? other : 0; // i dont like big if statements

    pSize = pSize_ + normalize(particleScaleBy, 0, 100, 0, 50)
    // efficient comparison of force distance scaled by particle size
    attraction2 = Math.pow(pSize * attractionDistance, 2);
    repulsion2 = Math.pow(pSize * repulsionDistance, 2);

    let modifier = 1.5

    // increase the offset by the modifier smaller if negative or bigger if positive
    // just scales the volume inputs appropriately, so it works better with the circle size
    vocal *= modifier * Math.sign(vocal);
    drum *= modifier * Math.sign(drum);
    bass *= modifier * Math.sign(bass);
    other *= modifier * Math.sign(other);

    // create circles array of length 4
    circles = Array.apply(null, Array(4)).map(
        (x, i) => {
            return {
                x: width / 2,
                y: height / 2,
                radius: largestCircle
                    - (i * circleStepSize)
                    + (i === 0 ? (vocal) : i === 1 ? drum : i === 2 ? bass : i === 3 ? other : 0) // cool ternary 😎
            }
        })

    // Use x circle for particle collision
    circle_ = circles[boundaryCircle]

    circles.forEach((circle, i) => {
        drawCircle(
            circle.x,
            circle.y,
            circle.radius * 2, // todo: vocal / 2 ?
            colours[i],
            0
        )
    })

    // pSize = sizeSlider.value();
    repulsionForce = tensionSlider.value();
    friction = frictionSlider.value();

    particles.forEach(particle => {
        // Calculate the vector pointing from the particle to the center of the screen
        let attraction = createVector(circle_.x - particle.pos.x, circle_.y - particle.pos.y);

        // Set magnitude by attraction force
        attraction.setMag(attractionForceSlider.value());

        // Apply the attraction force to the particle
        particle.applyForce(attraction);

        particles.forEach(everyOtherParticle => {
            particle.applyForce(particle.interaction(everyOtherParticle));
        });

        particle.show();
        particle.update();
    });

    push()
    fill(colours[1])
    noStroke()
    textSize(64)
    textFont(graf_font)
    text(words, 100, 100)
    pop()

}

/* https://editor.p5js.org/kwichmann/sketches/S1mqeS-oX
* modified to add collision for a circle in the center of the screen
* and also changes gravity force to an attraction force towards the center of the screen */
class Particle {

    constructor() {
        // spawn with random position and velocity
        this.pos = createVector(random(0, width), random(0, height))
        this.vel = createVector(random(-1, 1), random(-1, 1))
        this.force = createVector(0, 0)

        this.col = colours[rand(0, 3)]
    }

    show() {
        push()
        fill(this.col)
        ellipse(this.pos.x, this.pos.y, pSize)
        pop()
    }

    update() {
        // prevent the force from becoming too large
        if (this.force.magSq() >= force2) {
            this.force.setMag(maxForce);
        }

        this.vel.add(this.force)
        this.force = createVector(0, 0) // reset and recalculate each frame

        // prevent the velocity from becoming too large
        if (this.vel.magSq() >= vel2) {
            this.vel.setMag(maxVel)
        }

        this.pos.add(this.vel)

        // Collision between walls and particle
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1 * friction;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1 * friction;
        }

        // Collision between circle and particle
        // vector center of circle to particle
        // each vector contains distance of x and distance of y coords
        let dx = this.pos.x - circle_.x
        let dy = this.pos.y - circle_.y
        // Euclidean distance formula
        let distance = Math.sqrt(dx * dx + dy * dy);
        // console.log(distance)

        // If particle is inside circle factoring in particle size
        if (distance < circle_.radius + pSize / 2) {
            // Normalize the vector
            let normalX = dx / distance;
            let normalY = dy / distance;
            // console.log(normalX, normalY)

            // Calculate the dot product of the velocity and the normal
            // dot product is inner point (i think)
            let dotProduct = this.vel.x * normalX + this.vel.y * normalY;

            // Reflect the velocity vector
            this.vel.x -= 2 * dotProduct * normalX;
            this.vel.y -= 2 * dotProduct * normalY;

            // Apply friction
            this.vel.x *= friction;
            this.vel.y *= friction;

            // Move the particle out of the circle to avoid sticking
            let collisionOffset = 0;
            this.pos.x = circle_.x + normalX * (circle_.radius + collisionOffset + pSize / 2);
            this.pos.y = circle_.y + normalY * (circle_.radius + collisionOffset + pSize / 2);
        }

        // noinspection JSUnresolvedFunction
        this.pos.x = constrain(this.pos.x, 0, width);
        // noinspection JSUnresolvedFunction
        this.pos.y = constrain(this.pos.y, 0, height);
    }

    applyForce(f) {
        this.force.add(f);
    }

    interaction(particle) {
        // vector pointing from the current particle to the other particle
        let displacement = p5.Vector.sub(particle.pos, this.pos)
        // squared distance between the two particles
        const d2 = displacement.magSq();
        // the particles overlap or are too far apart to exert any significant force on each other
        if (d2 === 0 || d2 >= attraction2) {
            return createVector(0, 0);
        }
        displacement.normalize();
        // the particles are far enough apart to exert an attractive force on each other
        if (d2 >= repulsion2) {
            return p5.Vector.mult(displacement, attractionForce);
        }
        // the particles are close enough to repel each other
        return p5.Vector.mult(displacement, --repulsionForce)
    }
}

function drawCircle(x, y, diameter, colour = "none", strokeWeight_ = 10, strokeColour = "white") {
    push()
    if ("none" === colour) {
        noFill()
    } else {
        fill(colour)
    }
    stroke(strokeColour)
    strokeWeight(strokeWeight_)
    circle(x, y, diameter)
    pop()
}


/* Random integer */
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalize(value, min, max, normalMin, normalMax) {
    return normalMin + ((value - min) * (normalMax - normalMin)) / (max - min);
}