let palate = ["ffcbf2", "f3c4fb", "ecbcfd", "e5b3fe", "e2afff", "deaaff", "d8bbff", "d0d1ff", "c8e7ff", "c0fdff"];

// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    // debugTools();
    textFont("Arial");
    // noinspection JSUnresolvedFunction
    rectMode(CENTER)
    textSize(24);
    background(0)

    water_circles(vocal, drum, bass, other)
}

let pSize = 20;
let repulsionForce = 0.5;
let friction = 0.9;
let attractionForce = 0.1;
let attractionDistance = 2;
let repulsionDistance = 1;
let maxVel = 5;
let maxForce = 1;

// Derived quantities
let attraction2 = Math.pow(pSize * attractionDistance, 2);
let repulsion2 = Math.pow(pSize * repulsionDistance, 2);
let vel2 = Math.pow(maxVel, 2);
let force2 = Math.pow(maxForce, 2);

let gravity;

let circle_;

function water_circles(vocal, drum, bass, other) {
    circle_ = {
        x: width / 2,
        y: height / 2,
        radius: 150
    };

    drawCircle(
        circle_.x,
        circle_.y,
        circle_.radius * 2,
        "white",
        10,
        "white"
    )

    pSize = sizeSlider.value();
    repulsionForce = tensionSlider.value();
    friction = frictionSlider.value();

    particles.forEach(particle => {
        // Calculate the vector pointing from the particle to the center of the screen
        let attraction = createVector(circle_.x - particle.pos.x, circle_.y - particle.pos.y);

        // Normalize the vector and then scale it by the desired gravity magnitude
        attraction.setMag(gravitySlider.value());

        // Apply the gravitational attraction force to the particle
        particle.applyForce(attraction);

        particle.applyForce(gravity);
        particles.forEach(everyOtherParticle => {
            particle.applyForce(particle.interaction(everyOtherParticle));
        });

        particle.show();
        particle.update();
    });
}

/* https://editor.p5js.org/kwichmann/sketches/S1mqeS-oX
* modified to add collision for a circle in the center of the screen
* and also changes gravity force to an attraction force towards the center of the screen */
class Particle {

    id;

    // todo: Change gravity to point to center of screen
    // todo: Add a bounding circle that the particles bounce off

    constructor(id) {
        this.id = id

        this.pos = createVector(random(0, width), random(0, height))
        this.vel = createVector(random(-1, 1), random(-1, 1))
        this.force = createVector(0, 0)

        this.col = random(100, 200) // what is col?
    }

    show() {
        fill(this.col, this.col, 255)
        ellipse(this.pos.x, this.pos.y, pSize)
    }

    update() {
        // if the force becomes too strong set it to a max
        if (this.force.magSq() >= force2) {
            this.force.setMag(maxForce);
        }

        this.vel.add(this.force)
        this.force = createVector(0, 0)

        if (this.vel.magSq() >= vel2) {
            this.vel.setMag(maxVel)
        }

        this.pos.add(this.vel)

        // Makes the particle bounce off the walls of the canvas
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1 * friction;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1 * friction;
        }

        // vector center of circle to particle
        // each vector contains distance of x and distance of y coords
        let dx = this.pos.x - circle_.x
        let dy = this.pos.y - circle_.y
        // Euclidean distance formula
        let distance = Math.sqrt(dx * dx + dy * dy);
        // console.log(distance)

        if (distance < circle_.radius) {
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
            this.pos.x = circle_.x + normalX * circle_.radius;
            this.pos.y = circle_.y + normalY * circle_.radius;
        }


        // noinspection JSUnresolvedFunction
        this.pos.x = constrain(this.pos.x, 0, width);
        // noinspection JSUnresolvedFunction
        this.pos.y = constrain(this.pos.y, 0, height);
    }

    applyForce(f) {
        this.force.add(f);
    }

    interaction(drop) {
        let displacement = p5.Vector.sub(drop.pos, this.pos)
        const d2 = displacement.magSq();
        if (d2 === 0 || d2 >= attraction2) {
            return createVector(0, 0);
        }
        displacement.normalize();
        if (d2 >= repulsion2) {
            return p5.Vector.mult(displacement, attractionForce);
        }
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

/* https://stackoverflow.com/a/27406684 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColour() {
    return "#" + palate[random(0, 9)]
}

// todo: unused?
// function normalize(value, min, max, normalMin, normalMax) {
//     return normalMin + ((value - min) * (normalMax - normalMin)) / (max - min);
// }