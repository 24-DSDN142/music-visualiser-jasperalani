let palate = ["ffcbf2", "f3c4fb", "ecbcfd", "e5b3fe", "e2afff", "deaaff", "d8bbff", "d0d1ff", "c8e7ff", "c0fdff"];
let lastRandom = 0;

// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    // debugTools();
    textFont("Arial");
    // noinspection JSUnresolvedFunction
    rectMode(CENTER)
    textSize(24);

    speaker(vocal, drum, bass, other)
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

function speaker(vocal, drum, bass, other) {
// todo: cut out speaker on photoshop

    // Set image background
    image(img_speaker, 0, 0)

    const speakerCenterX = (width / 2) + 1;
    const speakerCenterY = (height / 2) + 155;

    // todo: write Jasper Alani over the speaker logo
    push()
    // fill("rgba(0, 0, 0, 0.85)")
    fill("black")
    rect(speakerCenterX, speakerCenterY + 250, 120, 40)
    pop()

    push()
    translate(speakerCenterX - 60, speakerCenterY + 250)
    scale(0.35)
    image(img_speaker_logo, 0, 0)
    pop()

    // push()
    // fill("black")
    // textWidth(60)
    // text("Jasper Alani", speakerCenterX-50, speakerCenterY+250)
    // pop()

    // speaker circle overlay
    push()
    fill("rgba(0, 0, 0, 0.4)")
    circle(speakerCenterX, speakerCenterY, 380)
    pop()

    // Rim
    drawCircle(speakerCenterX, speakerCenterY, 380, "none", 2)

    const strokeWeights = normalizeVolumes(vocal, drum, bass, other);

    drawCircle(speakerCenterX, speakerCenterY, 275 + vocal, "none", strokeWeights.vocal)
    drawCircle(speakerCenterX, speakerCenterY, 175 + drum, "none", strokeWeights.drum)
    drawCircle(speakerCenterX, speakerCenterY, 75 + bass, "none", strokeWeights.bass)
    drawCircle(speakerCenterX, speakerCenterY, 50 + other, "none", strokeWeights.other)

    push()
    noFill()
    stroke("white")
    strokeWeight(3)
    // first try circles
    // circle(width / 2, height / 2, 800 + vocal)
    // circle(width / 2, height / 2, 600 + drum)
    // circle(width / 2, height / 2, 400 + bass)
    // circle(width / 2, height / 2, 200 + other)
    pop()
}

function normalizeVolumes(vocal, drum, bass, other) {
    const normalMax = 6
    const normalMin = 1
    return {
        vocal: normalize(vocal, 0, 100, normalMin, normalMax),
        drum: normalize(drum, 0, 100, normalMin, normalMax),
        bass: normalize(bass, 0, 100, normalMin, normalMax),
        other: normalize(other, 0, 100, normalMin, normalMax)
    }
}

function normalize(value, min, max, normalMin, normalMax) {
    return normalMin + ((value - min) * (normalMax - normalMin)) / (max - min);
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