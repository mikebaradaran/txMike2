
qaTimer("qa-timer");

export function setTimerValue(seconds){
  getTimer().value = seconds;
  startTimer();
}

function qaTimer(tagName) {
    document.getElementsByTagName(tagName)[0].innerHTML = 
`<span id="startBtn">▶️</span>
<input type='range' min='0' max='3600' value='0' id='myTimer'/>
<output id='output'>00:00</output>`;

    document.getElementById('startBtn').addEventListener('click', startTimer);
    getTimer().addEventListener('input', showTime);
}

function stopTimer() {
    let stopWatch = getTimer().stopWatch;
    if (stopWatch !== null)
        clearInterval(stopWatch);
}

function startTimer() {
    stopTimer();
    let seconds = parseInt(getTimer().value);
    let myTimer = getTimer();
    myTimer.stopWatch = setInterval(function () {
        if (seconds <= 0) {
            timerFinishedAction();
            return;
        }
        myTimer.value = --seconds;
        showTime();
    }, 1000);
}

//---------------------------------------------------------------------
function timerFinishedAction() {
    const audio = 'https://cdn.glitch.global/7ea2c2b4-d4b6-41d3-afca-c4c259b797be/Alarm01.wav';
    stopTimer();
    display( "Ended at " + getTime() );
    new Audio(audio).play();
}

function showTime() {
    display( getMinSec() );
}

function getMinSec() {
    let seconds = parseInt(getTimer().value);
    return Math.floor(seconds / 60) + ":" + seconds % 60;
}

function getTime() {
    var today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

function getTimer() {
    return document.getElementById('myTimer');
}

function getOutput() {
    return document.getElementById('output');
}

function display(msg) {
    getOutput().innerHTML = msg;
}
