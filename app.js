var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var privateKey  = fs.readFileSync('sslcert/localhost.key', 'utf8');
var certificate = fs.readFileSync('sslcert/localhost.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var app = express();
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(8080, function(){
	console.log("Express app running at http://localhost:8080");
});
httpsServer.listen(8443, function(){
	console.log("Express app running at https://localhost:8443");
});
var savedNotesJSON;
fs.readFile('./data/saved_notes.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    savedNotesJSON = JSON.parse(data);
});

app.use(bodyParser.json());

app.use(function(req, res, next){

    // this custom callback fn is invoked first for each request
    // it is called with three arguments the request, response and the next fn in the pipeline 
    
    // this fn logs details about the request before returning the response 
    // log the request method, url and the request body
    console.log(`${req.method} request for ${req.url} - with body ${JSON.stringify(req.body)}`); 
    
    // after these details are logged the request needs to be served 
    // this app serves the request in the next piece of middleware under express.static 
    // therefore the app needs to move onto the next piece of middleware in the pipeline
    // the next fn is hence called.
    next();     
});

// parse application/json


// server static files from public folder
app.use(express.static("./public"));


app.get("/get-notes", function(req, res)
{
	res.json(savedNotesJSON);
});
app.post("/save-note", function(req, res)
{
	console.log("The JSON note is", req.body);
	savedNotesJSON.push(req.body);
	console.log(savedNotesJSON);
	updateJSONFile(JSON.stringify(savedNotesJSON));
});

function updateJSONFile(data)
{
	fs.writeFile('./data/saved_notes.json', data, function (err) {
  	if (err) throw err;
  	console.log('Saved!');
	});
}