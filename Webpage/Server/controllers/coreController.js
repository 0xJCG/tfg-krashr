var mongoose = require('mongoose'),
	Result = mongoose.model('Result'),
	User = mongoose.model('User');

exports.saveResult = function(request, response) {
	var b = request.body;
    console.log(b);
	User.findOne({USERNAME: b.USER}, function(error, user) {
	    if (user) {
	        var u = {NO_ID: user._id};
	        Result.create({PROCESS: b.PROCESS, WEB: b.WEB, VULNERABILITY: b.VULNERABILITY, USER: b.USER}, function(error, result) { // Inserting the new user.
                if (error)
                    response.status(500).send(false);
                else {
                    var r = {NO_ID: result._id};
                    User.update({USER: u}, {$push: {RESULTS: r}});
                    response.status(200).send(true);
                }
            });
	    } else
	        response.status(500).send(false);
	});
};