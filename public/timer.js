const audioFile = 'https://cdn.glitch.global/7ea2c2b4-d4b6-41d3-afca-c4c259b797be/Alarm01.wav?v=1685964726574';

function setTime(mins){
  document.getElementById('timer').value = mins;
  startTimer();
}

var myTimer = null;
function stopTimer() {
  if (myTimer !== null) clearInterval(myTimer);
}
function startTimer() {
  let mins = parseInt(document.getElementById('timer').value);
  if (mins < 0) return;

  stopTimer();
  showTime("");

  let seconds = mins * 60;

  myTimer = setInterval(function () {
    var minutes = (seconds / 60) | 0;

    if (seconds < 0) {
      stopTimer();
      showTime(mins + " minutes passed. Ended at " + getTime());
      new Audio(audioFile).play();
      return;
    }
    document.getElementById('divTimer').innerHTML = minutes + ":" + (seconds - minutes * 60);
    seconds--;
  }, 1000);
}

function showTime(msg){
  document.getElementById("message").innerHTML = msg;
}

function getTime() {
  var today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}
