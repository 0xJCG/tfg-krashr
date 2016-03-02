var mongoose = require('mongoose'),
    JsonSocket = require('json-socket'),
	UAParser = require('ua-parser-js'),
	_ = require('underscore'),
	Result = mongoose.model('Result'),
	User = mongoose.model('User'),
	Log = mongoose.model('Log');

exports.getResults = function(request, response) {
	var b = request.body, // Getting the data from the request.
        ip = request.headers['x-forwarded-for'] || // http://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress,
        parser = new UAParser(), // http://stackoverflow.com/questions/6163350/server-side-browser-detection-node-js
        ua = request.headers['user-agent'],
        browser = parser.setUA(ua).getBrowser().name + " " + parser.setUA(ua).getBrowser().version;

    // Logging.
	new Log({ACTION: "Getting all results attempt", USERNAME: b.USERNAME, IP: ip, BROWSER: browser}).save(function(error) {
        if (error)
            console.log(error);
    });

	/*User.findOne({USERNAME: b.USERNAME}).skip(b.SKIP * b.LIMIT).limit(b.LIMIT).populate('RESULTS').exec(function(error, user) {*/
	User.findOne({USERNAME: b.USERNAME}).limit(b.LIMIT).populate('RESULTS').exec(function(error, user) {
	    if (error || user == null) {
			response.status(500).send();
		} else {
			if (user.PASSWORD == b.PASSWORD) {
			    // Logging.
                new Log({ACTION: "All results got", USERNAME: b.USERNAME, IP: ip, BROWSER: browser}).save(function(error) {
                    if (error)
                        console.log(error);
                });

                // http://stackoverflow.com/questions/11090817/group-by-order-by-on-json-data-using-javascript-jquery
                var r = _.chain(user.RESULTS).sortBy("DATE", "WEB").groupBy("PROCESS", "WEB").value();

			    response.status(200).send(r);
			} else
			    response.status(200).send(false);
		}
	});
};

exports.getNumberResults = function(request, response) {
	var b = request.body, // Getting the data from the request.
        ip = request.headers['x-forwarded-for'] || // http://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress,
        parser = new UAParser(), // http://stackoverflow.com/questions/6163350/server-side-browser-detection-node-js
        ua = request.headers['user-agent'],
        browser = parser.setUA(ua).getBrowser().name + " " + parser.setUA(ua).getBrowser().version;

    // Logging.
	new Log({ACTION: "Getting number of results attempt", USERNAME: b.USERNAME, IP: ip, BROWSER: browser}).save(function(error) {
        if (error)
            console.log(error);
    });

	User.findOne({USERNAME: b.USERNAME}).populate('RESULTS').exec(function(error, user) {
	    if (error || user == null) {
			response.status(500).send();
		} else {
			if (user.PASSWORD == b.PASSWORD) {
			    // Logging.
                new Log({ACTION: "Number of results got", USERNAME: b.USERNAME, IP: ip, BROWSER: browser}).save(function(error) {
                    if (error)
                        console.log(error);
                });

                // http://stackoverflow.com/questions/11090817/group-by-order-by-on-json-data-using-javascript-jquery
                var r = _.chain(user.RESULTS).sortBy("DATE", "WEB").groupBy("PROCESS", "WEB").value();

                var d = {length: Object.keys(r).length}

                response.status(200).send(d);
			} else
			    response.status(200).send(false);
		}
	});
};

exports.getResult = function(request, response) {
	var b = request.body, // Getting the data from the request.
        ip = request.headers['x-forwarded-for'] || // http://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress,
        parser = new UAParser(), // http://stackoverflow.com/questions/6163350/server-side-browser-detection-node-js
        ua = request.headers['user-agent'],
        browser = parser.setUA(ua).getBrowser().name + " " + parser.setUA(ua).getBrowser().version;

    // Logging.
	new Log({ACTION: "Getting a result attempt", USERNAME: b.USERNAME, PROCESS: b.PROCESS, IP: ip, BROWSER: browser}).save(function(error) {
        if (error)
            console.log(error);
    });

	User.findOne({USERNAME: b.USERNAME}, function(error, user) { // Searching the user to check the password.
		if (user.PASSWORD == b.PASSWORD) { // If the passwords are the same...
			Result.findOne({PROCESS: b.PROCESS}, function(error, result) { // Searching the process is in the database.
				if (error) { // If there isn't...
					response.status(200).send(false); // If not, we send a 200 OK code, but the user will not be connected.
				} else { // The process exists.
					// Logging.
                    new Log({ACTION: "A result got", USERNAME: b.USERNAME, PROCESS: b.PROCESS, IP: ip, BROWSER: browser}).save(function(error) {
                        if (error)
                            console.log(error);
                    });
					response.status(200).send(result); // ...we send a 200 OK code with the result requested.
			    }
			});
		} else
			response.status(500).send(); // ...we send an 500 error code.
	});
};

exports.getCurrentResult = function(request, response) {
	var b = request.body, // Getting the data from the request.
        ip = request.headers['x-forwarded-for'] || // http://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress,
        parser = new UAParser(), // http://stackoverflow.com/questions/6163350/server-side-browser-detection-node-js
        ua = request.headers['user-agent'],
        browser = parser.setUA(ua).getBrowser().name + " " + parser.setUA(ua).getBrowser().version;

    // Logging.
	new Log({ACTION: "Getting the current result attempt", USERNAME: b.USERNAME, IP: ip, BROWSER: browser}).save(function(error) {
        if (error)
            console.log(error);
    });

	User.findOne({USERNAME: b.USERNAME}, function(error, user) { // Searching the user to check the password.
		if (user.PASSWORD == b.PASSWORD) { // If the passwords are the same...
			var msg = {
			    "user": b.USERNAME
			}

			// http://stackoverflow.com/questions/8407460/sending-data-from-node-js-to-java-using-sockets
			// Opening a socket to communicate with the Python server.
            var net = require('net');
            var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
            socket.connect(9999, '127.0.0.1');
            socket.on('connect', function() { //Don't send until we're connected
                socket.sendMessage(msg);
                socket.on('data', function(data) {
                    response.status(200).send(data);
                });
            });

			// Logging.
            new Log({ACTION: "Current status got", USERNAME: b.USERNAME, WEB: b.WEB, IP: ip, BROWSER: browser}).save(function(error) {
                if (error)
                    console.log(error);
            });
		} else
			response.status(500).send(); // ...we send an 500 error code.
	});
};

exports.search = function(request, response) {
	var b = request.body, // Getting the data from the request.
        ip = request.headers['x-forwarded-for'] || // http://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress,
        parser = new UAParser(), // http://stackoverflow.com/questions/6163350/server-side-browser-detection-node-js
        ua = request.headers['user-agent'],
        browser = parser.setUA(ua).getBrowser().name + " " + parser.setUA(ua).getBrowser().version;

    // Logging.
	new Log({ACTION: "Web searching attempt", USERNAME: b.USERNAME, WEB: b.URL, IP: ip, BROWSER: browser}).save(function(error) {
        if (error)
            console.log(error);
    });

	User.findOne({USERNAME: b.USERNAME}, function(error, user) { // Searching the user to check the password.
		if (user.PASSWORD == b.PASSWORD) { // If the passwords are the same...
			// var serverResponse = false;
			var msg = {
                "user": b.USERNAME,
                "url": b.URL,
                "search_options": [
                    {
                        "number": 1,
                        "module": "crawler"
                    },
                    {
                        "number": 2,
                        "module": "sqlinjection"
                    },
                    {
                        "number": 3,
                        "module": "crsf"
                    }
                ]
            }

            // https://github.com/sebastianseilund/node-json-socket
            JsonSocket.sendSingleMessage(9999, '127.0.0.1', msg, function(err) {
                if (!err) {
                    new Log({ACTION: "Web searched", USERNAME: b.USERNAME, WEB: b.WEB, IP: ip, BROWSER: browser}).save(function(error) {
                    if (error)
                        console.log(error);
                    });
                }
            });
			response.status(200).send(true);
		} else
			response.status(200).send(false);
	});
};