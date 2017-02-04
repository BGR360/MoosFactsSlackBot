var config = require('./config.js');

function isValidToken(token) {
	var validTokens = config['ValidSlackIntegrationTokens'];
	for (var i = 0; i < validTokens.length; i++) {
		var currentValidToken = validTokens[i].token;
		if (token === currentValidToken)
			return true;
	}
	return false;
}

function isValidRequest(request, response) {

	var token = request.body['token'];
	console.log("Token sent in payload:", token);
	if (token === undefined) {
		response.status(400).send("No token specified.");
		return false;
	}
	if (!isValidToken(token)) {
		response.status(401).send("Invalid authentication token.");
		return false;
	}

	return true;
}

exports.isValidRequest = isValidRequest;