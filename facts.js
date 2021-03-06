var config = require('./config.js'),
	jsonfile = require('jsonfile'),
	uniqueRandomArray = require('unique-random-array');

/**
 * These variables hold the contents of the files:
 * 		moosFacts.json, mooseFacts.json, exclamations.json
 */
var moosFacts = [];
var mooseFacts = [];
var exclamations = [];
var comptonQuotes = [];

/**
 * Loads the three files asynchronously
 */
function initialize(cb) {
	function loadThing(fileName, destination, cb) {
		jsonfile.readFile(fileName, function(err, jsonObj) {
			if (err) {
				console.error(err);
			} else {
				for (var i = 0; i < jsonObj.length; i++) {
					destination[i] = jsonObj[i];
				}
				cb();
			}
		});
	}
	loadThing('moosFacts.json', moosFacts, function() {
		console.log("Loaded moosFacts.json");
		loadThing('mooseFacts.json', mooseFacts, function() {
			console.log("Loaded mooseFacts.json");
			loadThing('exclamations.json', exclamations, function() {
				console.log("Loaded exclamations.json");
				loadThing('comptonQuotes.json', comptonQuotes, function() {
					console.log("Loaded comptonQuotes.json");
					cb();
				});
			});
		});
	});
}

/**
 * Returns a random exclamation to append to the end of any fact
 */
var exclamationRand;
function getExclamation() {
	if (moosFacts === undefined) {
		console.warn("Cannot get exclamation because exclamations.json did not load.");
		return "";
	}
	if (exclamationRand === undefined) {
		console.log("Initializing random array for exclamations.");
		exclamationRand = uniqueRandomArray(exclamations);
	}

	return exclamationRand();
}

/**
 * Returns a random Moos fact.
 */
var moosFactRand;
function getMoosFact() {
	if (moosFacts === undefined) {
		console.warn("Cannot get Moos fact because moosFacts.json did not load.");
		return "";
	}
	if (moosFactRand === undefined) {
		console.log("Initializing random array for moos facts.");
		moosFactRand = uniqueRandomArray(moosFacts);
	}

	var moosFact = moosFactRand();
	var factNumber = 30 + moosFacts.indexOf(moosFact);

	return "Moos Fact " + factNumber + ": " + moosFact + " " + getExclamation()
		+ "\n:moos: :moos: :moos:";
}

/**
 * Returns a random moose fact.
 */
var mooseFactRand;
function getMooseFact(cb) {
	if (moosFacts === undefined) {
		console.warn("Cannot get moose fact because mooseFacts.json did not load.");
		return "";
	}
	if (mooseFactRand === undefined) {
		console.log("Initializing random array for moose facts.");
		mooseFactRand = uniqueRandomArray(mooseFacts);
	}

	var mooseFact = mooseFactRand();
	var factNumber = 20 + mooseFacts.indexOf(mooseFact);

	return "Moose Fact " + factNumber + ": " + mooseFact + " " + getExclamation();
}

/**
 * Returns a random Compton quote
 */
var comptonQuoteRand;
function getComptonQuote(cb) {
	if (comptonQuotes.length == 0) {
		console.warn("Cannot get Compton quote because comptonQuotes.json did not load.");
		return "";
	}
	if (comptonQuoteRand === undefined) {
		console.log("Initializing random array for Compton quotes.");
		comptonQuoteRand = uniqueRandomArray(comptonQuotes);
	}

	var comptonQuote = comptonQuoteRand();
	return comptonQuote;
}

// 0 = moosFacts;
// 1 = mooseFacts;

/**
 * The slack bot will send periodic Moos Facts, about once a day.
 * These facts are more likely to be about Moos.
 */

/** Chances of getting a Moos fact are 5:1 **/
var periodicRand = uniqueRandomArray([ 0, 0, 0, 0, 0, 1 ]);

function getPeriodicFact() {
	
	var factType = periodicRand();
	if (factType === 0) {
		console.log("Sending a Moos fact!");
		return getMoosFact();
	} else {
		console.log("Sending a moose fact!");
		return getMooseFact();
	}

}

/**
 * When a user types `/moosfact`, we call this function.
 * These facts are more likely to be about moose.
 */

/** Chances of getting a moose fact are 3.5:1 **/
var slashCommandRand = uniqueRandomArray([ 1, 1, 1, 0, 1, 1, 1, 1, 0 ]);

function getSlashCommandFact() {

	var factType = slashCommandRand();
	if (factType === 0) {
		console.log("Sending a Moos fact!");
		return getMoosFact();
	} else {
		console.log("Sending a moose fact!");
		return getMooseFact();
	}

}

exports.initialize = initialize;
exports.getMoosFact = getMoosFact;
exports.getMooseFact = getMooseFact;
exports.getPeriodicFact = getPeriodicFact;
exports.getSlashCommandFact = getSlashCommandFact;
exports.getComptonQuote = getComptonQuote;
