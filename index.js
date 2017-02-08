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
