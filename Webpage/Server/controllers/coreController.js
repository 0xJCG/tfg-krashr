var mongoose = require('mongoose'),
	Result = mongoose.model('Result'),
	User = mongoose.model('User');

exports.saveResult = function(request, response) {
	var b = request.body;
    User.findOne({USERNAME: b.USER}, function(error, user) {
	    if (user) {
	        Result.create({PROCESS: b.PROCESS, WEB: b.WEB, VULNERABILITY: b.VULNERABILITY, USER: b.USER}, function(error, result) { // Inserting the new user.
                if (error)
                    response.status(500).send(false);
                else {
                    User.findByIdAndUpdate(
                        user._id,
                        {$push: {RESULTS: result._id}},
                        {safe: true, upsert: true, new : true},
                        function(err, model) {
                            console.log(err);
                        }
                    );
                    response.status(200).send(true);
                }
            });
	    } else
	        response.status(500).send(false);
	});
};