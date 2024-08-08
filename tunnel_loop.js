let palate = ["ffcbf2", "f3c4fb", "ecbcfd", "e5b3fe", "e2afff", "deaaff", "d8bbff", "d0d1ff", "c8e7ff", "c0fdff"];

let globalDModifier = 0.5;
let settings = {
    vocal: {
        diameter: 0,
        dModifier: 1.25 * globalDModifier,
        colour: "#" + palate[0],
        opacity: Math.random(),
    },
    drum: {
        diameter: 0,
        dModifier: 1.25 * globalDModifier,
        colour: "#" + palate[1],
        opacity: Math.random(),
    },
    bass: {
        diameter: 0,
        dModifier: 1.25 * globalDModifier,
        colour: "#" + palate[2],
        opacity: Math.random(),
    },
    other: {
        diameter: 0,
        dModifier: 1.25 * globalDModifier,
        colour: "#" + palate[3],
        opacity: Math.random(),
    },
};
let objects = []
let gridStep = 20;
let draw_ = true; // debug tool disable drawing objects
let colour = "#" + palate[0];
let lastRandom = 0;
let img;

// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    // debugTools();
    textFont("Arial");
    // noinspection JSUnresolvedFunction
    rectMode(CENTER)
    textSize(24);

    // Set image background
    image(img, 0, 0)

    // todo: cut out speaker on photoshop
    // drawExpandingCircle(speakerCenterX, speakerCenterY, settings.vocal, vocal)

    // drawPerspectiveLines()

    let speakerCenterX = (width / 2) + 1;
    let speakerCenterY = (height / 2) + 155;

    push()
    noFill()
    stroke("white")
    strokeWeight(5)

    // Rim
    circle(speakerCenterX, speakerCenterY, 420)



    // circle(width / 2, height / 2, 800 + vocal)
    // circle(width / 2, height / 2, 600 + drum)
    // circle(width / 2, height / 2, 400 + bass)
    // circle(width / 2, height / 2, 200 + other)

    pop()
}

function drawPerspectiveLines(){
    push()
    stroke("white")
    strokeWeight(5)
    let x1, y1;
    let points = getEvenCirclePoints(width / 2, height / 2, 200 + other, 8)
    for (let i = 0; i < points.length; i++) {
        if(i % 2 === 0){
            continue;
        }
        switch (i) {
            case 5:
                x1 = 0;
                y1 = 0;
                break;
            case 7:
                x1 = width;
                y1 = 0;
                break;
            case 3:
                x1 = 0;
                y1 = height;
                break;
            case 1:
                x1 = width;
                y1 = height;
                break;
        }
        line(x1, y1, points[i].x, points[i].y)
    }
    pop()
}

function drawExpandingCircle(x, y, object, speed) {
    push();
    let rgba = hexToRgba(object.colour, object.opacity)
    fill(rgba);
    strokeWeight(0)
    if (object.diameter < canvasWidth + 1500) {
        //noinspection JSUnresolvedFunction
        draw_debug(() => circle(x, y, object.diameter))
    } else {
        object.diameter = 0;
        // background(object.colour)
        object.colour = randomColour();
        object.opacity = Math.random();
    }
    draw_debug(() => object.diameter += speed * object.dModifier)
    pop();
}

function getEvenCirclePoints(centerX, centerY, diameter, n) {
    const points = [];
    const angleIncrement = (2 * Math.PI) / n;

    // Find the points by taking the angle increment and multiplying it the radius
    for (let i = 0; i < n; i++) {
        const angle = i * angleIncrement;
        const x = centerX + (diameter / 2) * Math.cos(angle);
        const y = centerY + (diameter / 2) * Math.sin(angle);
        points.push({x: x, y: y});
    }

    return points;
}

/* https://stackoverflow.com/a/5624139 */
function hexToRgba(hex, opacity = 1) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + opacity + ")"
        : null;
}

// Generate random number until it's different from the last one generated
/* https://stackoverflow.com/a/27406684 */
function rand_(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (num === lastRandom) {
        return rand_(min, max)
    } else {
        return lastRandom = num
    }
}

function randomColour() {
    return "#" + palate[rand_(0, 9)]
}

function draw_debug(callback, force) {
    if (draw_ || force) {
        callback()
    }
}

/* https://editor.p5js.org/kchung/sketches/rkp-wOIF7 */
function debugTools() {
    background(200);
    stroke(220);
    strokeWeight(1);
    for (let x = 0; x <= width; x += gridStep) {
        for (let y = 0; y <= height; y += gridStep) {
            line(x, 0, x, height);
            line(0, y, width, y);
        }
    }
    textFont('menlo');
    textSize(14);
    noStroke();
    text("x:" + mouseX, 10, 20);
    text("y:" + mouseY, 10, 40);
    stroke('black'); // reset stroke
}