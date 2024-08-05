let diameter = {
    vocal: 0,
    drum: 0,
    bass: 0,
    other: 0
};
let objects = []
let colour = "white";

// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    background(20)
    textFont('Arial');
    rectMode(CENTER)
    textSize(24);

    // todo: Make tunnel loop

    // circillusion: a circle getting bigger each frame causing an illusion

    // Vocals circillusion
    translate(width / 4, height / 4);
    push();
    fill(colour);
    strokeWeight(0)
    console.log("vocal: " + diameter.vocal)
    if (diameter.vocal < canvasWidth + 500) {
        circle(0, 0, diameter.vocal);
    } else {
        diameter.vocal = 0;
        if (colour === "black") {
            colour = "white"
        } else {
            colour = "black"
        }
    }
    pop();
    diameter.vocal += vocal * 1.25

    // Drums circillusion
    translate(width / 2, height / 4);
    push();
    fill(colour);
    strokeWeight(0)
    console.log("drum: " + diameter.drum)
    if (diameter.drum < canvasWidth + 500) {
        circle(0, 0, diameter.drum);
    } else {
        diameter.drum = 0;
        if (colour === "black") {
            colour = "white"
        } else {
            colour = "black"
        }
    }
    pop();
    diameter.drum += drum * 1.25
}