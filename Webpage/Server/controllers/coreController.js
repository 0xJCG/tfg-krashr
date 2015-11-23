var mongoose = require('mongoose'),
	Result = mongoose.model('Result'),
	User = mongoose.model('User');

exports.saveResult = function(request, response) {
	var b = request.body;

	Result.create({PROCESS: b.PROCESS, WEB: b.WEB, VULNERABILITY: b.VULNERABILITY, USER: b.USER}, function(error, result) { // Inserting the new user.
		if (error)
			response.status(500).send(false);
		else {
			var r = {NO_ID: result._id};
			User.update({USER: b.USER}, {$push: {RESULTS: r}}, function(error, model) {
				if (error)
					response.status(500).send(false);
				else
					response.status(200).send(true);
			});
		}
	});
};