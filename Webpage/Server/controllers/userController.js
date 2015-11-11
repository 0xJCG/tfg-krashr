var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.login = function(request, response) {
	var b = request.body; // Getting the data from the request.
	
	User.findOne({USERNAME: b.USERNAME}, function(error, user) { // Searching the user is in the database.
		if (error) { // If there isn't...
			response.status(500).send(); // ...we send an 500 error code.
		} else { // The user exists.
			if (user.PASSWORD == b.PASSWORD) // If the passwords are the same...
				response.status(200).send(true); // ...we send a 200 OK code, the user is connected.
			else
				response.status(200).send(false); // If not, we send a 200 OK code, but the user will not be connected.
		}
	});
};

exports.updatePassword = function(request, response) {
	var b = request.body;

	User.findOne({US_NAME:b.US_NAME}, function(error, user) { // We have to search the user to know if exists.
		if (error) { // Doesn't exist.
			response.status(500).send(false);
		} else { // Exists.
			if (user.PASSWORD == b.OLD) { // The passwords must be the same.
				User.findByIdAndUpdate( // Updating the password.
				    user._id,
                    {$set: {PASSWORD: b.NEW}},
                    {safe: true, upsert: true},
                    function(error, model) {
                        if (error) // If it hasn't been able to change the password...
                            response.status(500).send(); // ...sending an error.
                        else
                            response.status(200).send(true); // If there is all OK, sending 200 OK code.
                    }
                );
			} else { // Passwords don't match.
				response.status(200).send(false);
			}
				
		}
	});
};

exports.updateUserInfo = function(request, response) {
	var b = request.body;

	User.findOne({US_NAME:b.US_NAME}, function(error, user) { // We have to search the user to know if exists.
		if (error) { // Doesn't exist.
			response.status(500).send(false);
		} else { // Exists.
			if (user.PASSWORD == b.PASSWORD) { // The passwords must be the same.
				User.findByIdAndUpdate( // Updating the user.
				    user._id,
                    {$set: {NAME: b.NAME, LASTNAME: b.LASTNAME, BIRTHDATE: b.BIRTHDATE}},
                    {safe: true, upsert: true},
                    function(error, model) {
                        if (error) // If it hasn't been able to change the password...
                            response.status(500).send(); // ...sending an error.
                        else
                            response.status(200).send(true); // If there is all OK, sending 200 OK code.
                    }
                );
			} else { // Passwords don't match.
				response.status(200).send(false);
			}

		}
	});
};

exports.signUp = function(request, response) {
	var b = request.body;
	
	User.findOne({USERNAME: b.USERNAME}, function(error, user) { // The new user must not exist already.
		if (error) {
			response.status(500).send();
		} else { // The user doesn't exist.
		    User.findOne({EMAIL: b.EMAIL}, function(error, user) { // Now, the new email must not exist already.
		        if (user === null) {
                    new User({USERNAME: b.USERNAME, PASSWORD: b.PASSWORD, EMAIL: b.EMAIL}).save(function(error) { // Inserting the new user.
                        if (error)
                            response.status(500).send();
                        else
                            response.status(200).send(true);
                    });
			    } else
				    response.status(200).send(false);
		    }
		}
	});
};