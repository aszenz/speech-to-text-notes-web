window.onload= function(){
	var  xhr = new XMLHttpRequest();
	var divContainer = document.getElementById("AllNotes");
	xhr.open("GET", "/get-notes", true);
	xhr.send();
    var htmlString = "";
	xhr.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	        var notesJSON = JSON.parse(xhr.responseText);
	        console.log(notesJSON);
	        for(var note in notesJSON) {
	        	console.log(note);
	 	   		htmlString += "<span>" + notesJSON[note].NoteIndex + "</span>";
	 	   		htmlString += "<p>" + notesJSON[note].NoteContents + "</p>";
			}
			divContainer.innerHTML = htmlString;
	   }
	};
	
}