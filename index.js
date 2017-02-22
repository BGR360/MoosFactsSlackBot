var config = require('./config.js');
var facts = require('./facts.js');
var subscribers = require('./subscribers.js');
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

	///console.log(request);
	
	// Validate the Slack token
	if (validation.isValidRequest(request, response)) {

		// Save the new subscriber
		var responseUrl = request.body['response_url'];
		console.log("Response url:", responseUrl);
		///subscribers.addNewSubscription(responseUrl);

		// Send a fact
		response.json({
			"response_type": "in_channel",
			"text": facts.getSlashCommandFact()
		});
	}

});

app.get('/getComptonQuote', function(request, response) {
	// Send a quote
	response.json({
		"response_type": "in_channel",
		"text": facts.getComptonQuote()
	});
});

app.post('/getComptonQuote', function(request, response) {
	// Validate the Slack token
	if (validation.isValidRequest(request, response)) {
		// Send a quote
		response.json({
			"response_type": "in_channel",
			"text": facts.getComptonQuote()
		});
	}
});

app.get('/getScheduledMoosFact', function(request, response) {
	var fact = facts.getPeriodicFact();
	subscribers.sendFactToAllSubscribers(fact, function(err) {
		if (err) {
			response.status(500).send(err);
		} else {
			console.log("All facts sent");
			response.send("Success");
		}
	});
});

app.post('/ping', function(request, response) {
	var message = request.body['text'];
	if (message) {
		// Screw you, Hannah
		var numPings = (message.match(/\bping\b/ig) || []).length;
		var text = "";
		for (var i = 0; i < numPings; i++) {
			text += "pong ";
		}
		// remove last space
		text = text.substring(0, text.length - 1);
		response.json({
			text: text
		});
	} else {
		response.json({
			text: "pong"
		});
	}	
});

app.post('/broken', function(request, response) {
	response.json({
		text: "Shut up."
	});
});

// First, load the json files for the Moos/moose facts. Then start up the server
facts.initialize(function callback() {
	// Second, load the subscribers list
	subscribers.initialize(function callback() {
		// Finally, start the server
		app.listen(app.get('port'), function() {
		  console.log('Node app is running on port', app.get('port'));
		});
	});
});
