var config = require('./config.js');
var facts = require('./facts.js');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send("Hello World!");
});

app.get('/getMoosFact', function(request, response) {
	response.json({
		"text": "A fact!"
	});
});

app.post('/getMoosFact', function(request, response) {
	
	// Validate the Slack token
	var correctToken = config['SlackIntegrationKey'];
	var actualToken = request.body['token'];
	console.log("Token sent in payload:", actualToken);
	if (actualToken === undefined) {
		response.status(400).send("No token specified.");
		return;
	}
	if (actualToken !== correctToken) {
		response.status(401).send("Invalid authentication token.");
		return;
	}

	// Get a fact
	var theFact = facts.getSlashCommandFact();

	// Send the response
	response.json({
		"text": theFact
	});

});

facts.initialize(function callback() {
	app.listen(app.get('port'), function() {
	  console.log('Node app is running on port', app.get('port'));
	});
});
