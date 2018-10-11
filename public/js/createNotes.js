var noteTextArea = document.getElementsByTagName("textarea")[0];
var btStart = document.getElementsByClassName("bt-start")[0];
var btPause = document.getElementsByClassName("bt-pause")[0];
var btSave = document.getElementsByClassName("bt-save")[0];
var lbInfo = document.getElementsByClassName("lb-info")[0];
var smallCircle = document.getElementById("small-circle");

var noteContent = "";

try
{
	var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	var recognition = new SpeechRecognition();
}
catch(e)
{
	console.error(e);
	console.log("No browser support");
}

recognition.onstart = function()
{
  smallCircle.className += " blink";
	lbInfo.textContent = "Voice recognition activated. Try speaking into the microphone.";
};

recognition.onspeechend = function()
{
  smallCircle.className = "rec-notifier";
	lbInfo.textContent = "You were quiet for a while so voice recognition turned itself off.";
};
recognition.onerror = function(event) {
  smallCircle.className = "rec-notifier";
  if(event.error == 'no-speech') {
    lbInfo.textContent = 'No speech was detected. Try again.';  
  }
};
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  // Add the current transcript to the contents of our Note.
  if(!mobileRepeatBug) 
  {
    noteContent += transcript;
    noteTextarea.textContent = noteContent;
  }
};

btStart.addEventListener("click", function(){
	recognition.start();
});

btPause.addEventListener("click", function(){
	recognition.stop();
  smallCircle.className = "rec-notifier";
  lbInfo.textContent = "Voice recognition paused. Click start to continue";
});
btSave.addEventListener("click", function(){
  xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/save-note", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  var noteData = noteTextArea.value;
  console.log(noteData);
  var jsonString = '{"NoteIndex": "1", "NoteContents": "' + noteData + '"}';
  console.log(jsonString);
  xhttp.send(jsonString);
});
