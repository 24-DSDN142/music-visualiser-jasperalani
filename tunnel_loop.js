let palate = ["ffcbf2", "f3c4fb", "ecbcfd", "e5b3fe", "e2afff", "deaaff", "d8bbff", "d0d1ff", "c8e7ff", "c0fdff"];
let lastRandom = 0;
let globalDModifier = 1;
let settings = {
    vocal: {
        diameter: 0,
        dModifier: 1.25 * globalDModifier,
        colour: "#" + palate[0],
        opacity: 1, // Math.random(),
    },
    drum: {
        diameter: 0,
        dModifier: 1.25 * globalDModifier,
        colour: "#" + palate[1],
        opacity: 1, // Math.random(),
    },
    bass: {
        diameter: 0,
        dModifier: 1.25 * globalDModifier,
        colour: "#" + palate[2],
        opacity: 1, // Math.random(),
    },
    other: {
        diameter: 0,
        dModifier: 1.25 * globalDModifier,
        colour: "#" + palate[3],
        opacity: 1, // Math.random(),
    },
};


// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    // debugTools();
    textFont("Arial");
    // noinspection JSUnresolvedFunction
    rectMode(CENTER)
    textSize(24);

    tunnel_loop(vocal, drum, bass, other)
}

function tunnel_loop(vocal, drum, bass, other) {
    drawExpandingCircle((width / 2), height / 2, settings.vocal, vocal)
    drawExpandingCircle((width / 2), height / 2, settings.drum, drum)
    drawExpandingCircle((width / 2), height / 2, settings.bass, bass)
    drawExpandingCircle((width / 2), height / 2, settings.other, other)

    // drawPerspectiveLines(other)
}

function drawPerspectiveLines(other) {
    push()
    stroke("white")
    strokeWeight(5)
    let x1, y1;
    let points = getEvenCirclePoints(width / 2, height / 2, 200, 8)
    for (let i = 0; i < points.length; i++) {
        if (i % 2 === 0) {
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

function drawExpandingCircle(x, y, object, speed){
    push();
    fill(hexToRgba(object.colour, object.opacity));
    strokeWeight(0)

    object.diameter += (speed * object.dModifier)

    // Reset if circle gets bigger than the screen
    if(object.diameter > (canvasWidth + 500)){
        // background(object.colour)
        object.diameter = 0;
        object.colour = randomColour();
        object.opacity = 1; // Math.random();
        pop();
        return
    }

    //noinspection JSUnresolvedFunction
    circle(x, y, object.diameter)

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

function normalize(value, min, max, normalMin, normalMax) {
    return normalMin + ((value - min) * (normalMax - normalMin)) / (max - min);
}

/* https://stackoverflow.com/a/5624139 */
function hexToRgba(hex, opacity = 1) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + opacity + ")"
        : null;
}

/* https://stackoverflow.com/a/27406684
* Generate random number until it's different from the last one generated */
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