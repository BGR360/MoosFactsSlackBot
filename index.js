var config = require('./config.js');
var facts = require('./facts.js');
var validation = require('./validation.js');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

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

	console.log(request);
	
	// Validate the Slack token
	if (validation.isValidRequest(request, response)) {
		// Send a fact
		response.json({
			"text": facts.getSlashCommandFact()
		});
	}

});

// First, load the json files for the Moos/moose facts. Then start up the server
facts.initialize(function callback() {
	app.listen(app.get('port'), function() {
	  console.log('Node app is running on port', app.get('port'));
	});
});
