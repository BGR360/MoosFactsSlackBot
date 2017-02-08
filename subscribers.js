var config = require('./config.js'),
	jsonfile = require('jsonfile'),
	request = require('request');

// A list of Slack response_urls that are subscribed
var subscriptions = [];

const SUBSCRIPTIONS_JSON_PATH = 'subscriptions.json';

function initialize(cb) {
	// Then, load the json file for currently subscribed urls
	jsonfile.readFile(SUBSCRIPTIONS_JSON_PATH, function(err, jsonArr) {
		if (err) {
			console.error(err);
		} else {
			console.log("Loaded subscribedUrls.json");
			subscriptions = jsonArr;
			cb();
		}
	});
}

function subscriptionExists(subscription) {
	return subscriptions.indexOf(subscription) != -1;
}

function addNewSubscription(subscription, cb) {
	if (!subscriptionExists(subscription)) {
		subscriptions.push(subscription);

		// Save the new file
		jsonfile.writeFile(SUBSCRIPTIONS_JSON_PATH, subscriptions, {spaces: 2}, function(err) {
			if (err) {
				console.warn("[WARN] Error saving subscriptions file locally:", err);
			} else {
				console.log("Added subscriber and saved subscriptions.json");
				cb();
			}
		});
	}
}

function sendFactToAllSubscribers(fact, cb) {
	console.log("Sending a fact to the following subscribers:", subscriptions);
	json = {
		//"response_type": "in_channel",
		"text": fact
	};
	var i = 0;
	sendToNext();
	function sendToNext(err) {
		if (err) {
			cb(err);
			return;
		}
		if (i < subscriptions.length) {
			url = subscriptions[i++];
			sendPostRequest(url, json, sendToNext);
		} else {
			cb();
		}
	}
}

/** Some code here courtesy of Profstyle on StackOverflow */
function sendPostRequest(url, json, cb) {

	// Set the headers
	var headers = {
	    'Content-Type': 'application/json'
	};

	// Configure the request
	var options = {
	    url: url,
	    method: 'POST',
	    headers: headers,
	    json: true,
	    body: json
	};

	// Start the request
	request(options, function (error, response, body) {
		if (error) {
			console.error("[ERR] Error sending POST request:", error);
			cb(error);
		} else if (response.statusCode != 200) {
			console.error("[ERR] POST request received non-OK status:", 
				response.statusCode, ":", body);
			cb("ERROR " + response.statusCode);
		} else {
	        console.log("POST request sent to", url);
	        cb();
	    }
	});
}

exports.initialize = initialize;
exports.addNewSubscription = addNewSubscription;
exports.sendFactToAllSubscribers = sendFactToAllSubscribers;
