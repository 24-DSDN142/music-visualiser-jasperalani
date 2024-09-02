let words_history = [];
let vocal_history = [];
let drum_history = [];
let bass_history = [];
let other_history = [];

function normalize(value, min, max, normalMin, normalMax) {
    return normalMin + ((value - min) * (normalMax - normalMin)) / (max - min);
}

function draw_history_line(history) {
    // noinspection JSUnresolvedFunction
    beginShape(LINES);
    strokeWeight(5)
    for (let i = 0; i < history.length; i++) {
        let x = i * 4;
        let y = map(history[i], 0, 100, height, height / 8, true);
        let lastY = map(history[i-1], 0, 100, height, height / 8, true);

        y = normalize(y, 0, height, 150, 300)
        lastY = normalize(lastY, 0, height, 150, 300)
        // vertex(x, y)
        // lastY = normalize(y, 0, height, 200, 100)
        line(x, y, x, lastY);
    }
    // noinspection JSUnresolvedFunction
    endShape();
}

function add_to_history(history, d) {
    history.push(d);
    if (history.length >= (width - 1) / 4) {
        history.shift();
    }
}

function reset_music() {
    vocal_history = [];
    drum_history = [];
    bass_history = [];
    other_history = [];
}

let hideLines = [];

function draw_one_frame(words, vocal, drum, bass, other, counter){
    background(20);

    // add_to_history(words_history, words);
    add_to_history(vocal_history, vocal);
    add_to_history(drum_history, drum);
    add_to_history(bass_history, bass);
    add_to_history(other_history, other);

    // function startTimer() {
    //     // This function will be called every 5 seconds
    //     const intervalId = setInterval(() => {
    //         console.log('Timer started');
    //
    //         hideLines.push(2)
    //
    //         // After 2 seconds, stop the timer
    //         const timeoutId = setTimeout(() => {
    //             hideLines.pop()
    //         }, 2000); // 2000 milliseconds = 2 seconds
    //
    //     }, 5000); // 5000 milliseconds = 5 seconds
    //
    //     // // Optionally, you can stop the interval after a certain time if needed
    //     // setTimeout(() => {
    //     //     clearInterval(intervalId);
    //     //     console.log('Interval cleared');
    //     // }, 30000); // 30000 milliseconds = 30 seconds, or 6 cycles
    // }

    // startTimer();
    //
    // stroke("white")
    // drawStationaryLines()
    //
    // if(hideLines.includes(2)){
    //     stroke("white");
    //     draw_history_line(vocal_history);
    // }


    // let mapped_y = map(vocal, 0, 100, 100, height - 100, true);
    // square(500, mapped_y, 50)


    for(let i = 0; i < 5; i++){
        square(500, 100 + (i * 100), 50)
    }



    // if(counter % 100 === 0){
    //     stroke("white");
    //     draw_history_line(vocal_history);
    //     drawStationaryLines(2)
    //
    // }else{
    //     drawStationaryLines()
    // }
    //
    // strokeWeight(10);

    // drawStationaryLines(0)

    // vocal bar is red


    // // drum bar is green
    // stroke(0, 200, 0);
    // draw_history_line(drum_history);
    //
    // // bass bar is blue
    // stroke(0, 0, 200);
    // draw_history_line(bass_history);
    //
    // // other bar is white
    // stroke(200, 200, 200);
    // draw_history_line(other_history);
}

function drawStationaryLines(hide = -1, n = 100) {
    let y = 100;
    push()
    strokeWeight(10)
    fill("white")
    for(let i = 0; i < n; i++) {
        if(hideLines.includes(i)){
            y += 100
            continue;
        }
        line(0, y, width, y)
        y += 100
        console.log(y)
    }
    pop()
}