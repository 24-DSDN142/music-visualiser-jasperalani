let settings = {
    vocal: {
        diameter: 0,
        dModifier: 1.25
    },
    drum: {
        diameter: 0,
        dModifier: 1.25
    },
    bass: {
        diameter: 0,
        dModifier: 1.25
    },
    other: {
        diameter: 0,
        dModifier: 1.25
    },
};
let objects = []
let colour = "white";
let u = 20;
let draw_ = true; // debug tool disable drawing objects

// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    grid();
    displayMousePosition();

    // background(20)
    textFont('Arial');
    rectMode(CENTER)
    textSize(24);

    // todo: Make tunnel loop

    drawExpandingCircle(0, 0, settings.vocal, vocal)
    drawExpandingCircle(width, 0, settings.drum, drum)
    drawExpandingCircle(0, height, settings.bass, bass)
    drawExpandingCircle(width, height, settings.other, other)
}

function drawExpandingCircle(x, y, object, volume) {
    push();
    fill(colour);
    strokeWeight(0)
    if (object.diameter < canvasWidth + 500) {
        draw_debug(() => circle(x, y, object.diameter))
    } else {
        object.diameter = 0;
        colour = colour === "black" ? "white" : "black";
    }
    draw_debug(() => object.diameter += volume * object.dModifier)
    pop();
}

function draw_debug(callback, force){
    if(draw_ || force){
        callback()
    }
}

function grid() {
    background(200);
    stroke(220);
    strokeWeight(1);
    for (let x = 0; x <= width; x += u) {
        for (let y = 0; y <= height; y += u) {
            line(x, 0, x, height);
            line(0, y, width, y);
        }
    }
}

function displayMousePosition() {
    textFont('menlo');
    textSize(14);
    noStroke();
    text("x:" + mouseX, 10, 20);
    text("y:" + mouseY, 10, 40);
    stroke('black'); // reset stroke
}