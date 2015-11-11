var mongoose = require('mongoose'),
	Result = mongoose.model('Result'),
	User = mongoose.model('User');

exports.getAllResults = function(request, response) {
	var b = request.body;

	User.findOne({US_NAME: b.US_NAME}).populate('Results.PROCESS').exec(function(error, user) {
		if (error || user == null) {
			response.status(500).send();
		} else {
			if (user.US_PASS == b.US_PASS)
			    response.status(200).send(user.RESULTS);
			else
			    response.status(200).send(false);
			}
		}
	});
};

exports.getResult = function(request, response) {
	var b = request.body; // Getting the data from the request.

	User.findOne({USERNAME: b.USERNAME}, function(error, user) { // Searching the user to check the password.
		if (user.PASSWORD == b.PASSWORD) { // If the passwords are the same...
			Result.findOne({PROCESS: b.PROCESS}, function(error, result) { // Searching the process is in the database.
				if (error) { // If there isn't...
					response.status(200).send(false); // If not, we send a 200 OK code, but the user will not be connected.
				} else // The process exists.
					response.status(200).send(result); // ...we send a 200 OK code with the result requested.
			});
		} else
			response.status(500).send(); // ...we send an 500 error code.
	});
};

exports.getResult = function(request, response) {
	var b = request.body; // Getting the data from the request.

	User.findOne({USERNAME: b.USERNAME}, function(error, user) { // Searching the user to check the password.
		if (user.PASSWORD == b.PASSWORD) { // If the passwords are the same...
		    var python;
		    var output = "";
            switch (user.TYPE) {
                case 1: // Basic users.
                    python = require('child_process').spawn('python', // second argument is array of parameters, e.g.:
                         ["/home/me/pythonScript.py", req.files.myUpload.path, req.files.myUpload.type]
                         );
                    python.stdout.on('data', function(){ output += data });
                    break;
                default: // Pro and admin users.
                    python = require('child_process').spawn('python', // second argument is array of parameters, e.g.:
                         ["/home/me/pythonScript.py", req.files.myUpload.path, req.files.myUpload.type]
                         );
                    python.stdout.on('data', function(){ output += data });
            }
            python.on('close', function(code) {
                if (code !== 0)
                    return res.send(500, code);
                return res.send(200, output)
            });
		} else
			response.status(500).send(); // ...we send an 500 error code.
	});
};