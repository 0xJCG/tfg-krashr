var mongoose = require('mongoose'),
	UAParser = require('ua-parser-js'),
	Result = mongoose.model('Result'),
	User = mongoose.model('User'),
	Log = mongoose.model('Log');

exports.getAllResults = function(request, response) {
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

	User.findOne({US_NAME: b.US_NAME}).populate('Results.PROCESS').exec(function(error, user) {
		if (error || user == null) {
			response.status(500).send();
		} else {
			if (user.US_PASS == b.US_PASS) {
			    // Logging.
                new Log({ACTION: "All results got", USERNAME: b.USERNAME, IP: ip, BROWSER: browser}).save(function(error) {
                    if (error)
                        console.log(error);
                });
			    response.status(200).send(user.RESULTS);
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
			if (user.RESULTS.length != 0)
			    response.status(200).send(false);
    		current = false;
    		user.RESULTS.forEach(function(result) {
    		    if (result.CURRENT)
    		        current = result;
            });
            if (!current) {
                new Log({ACTION: "There are no current results", USERNAME: b.USERNAME, IP: ip, BROWSER: browser}).save(function(error) {
                    if (error)
                        console.log(error);
                });
            }
            new Log({ACTION: "There are current results", USERNAME: b.USERNAME, PROCESS: current.PROCESS, IP: ip, BROWSER: browser}).save(function(error) {
                if (error)
                    console.log(error);
            });
    		response.status(200).send(current);
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
	new Log({ACTION: "Web searching attempt", USERNAME: b.USERNAME, WEB: b.WEB, IP: ip, BROWSER: browser}).save(function(error) {
        if (error)
            console.log(error);
    });

	User.findOne({USERNAME: b.USERNAME}, function(error, user) { // Searching the user to check the password.
		if (user.PASSWORD == b.PASSWORD) { // If the passwords are the same...
			var serverResponse;
			var msg = {
                "user": b.USERNAME,
                "url": b.WEB,
                "search_options": [
                    {
                        "number": 1,
                        "module": "crawler"
                    },
                    {
                        "number": 3,
                        "module": "incorrectsecurity"
                    }
                ]
            }

			// http://stackoverflow.com/questions/8407460/sending-data-from-node-js-to-java-using-sockets
			// Opening a socket to communicate with the Python server.
            var net = require('net');
            var python = net.connect({port: 8124, host: "localhost"},
                function() { //'connect' listener
                console.log('connected to server!');
                python.write(msg); // Sending data to the Python server.
            });
            python.on('data', function(data) {
                serverResponse = data.toString();
                client.end();
            });
            python.on('end', function() {
                console.log('disconnected from server');
            });

			// Logging.
            new Log({ACTION: "Web searching", USERNAME: b.USERNAME, WEB: b.WEB, IP: ip, BROWSER: browser}).save(function(error) {
                if (error)
                    console.log(error);
            });
			response.status(200).send(serverResponse);
		} else
			response.status(200).send(false);
	});
};