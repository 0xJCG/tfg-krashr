exports = module.exports = function(app, mongoose) {
	var Schema = mongoose.Schema;
	var logSchema = new Schema({
		ACTION: {type: String, required: true},
		USERNAME: {type: String, required: true},
		WEB: {type: String},
		PROCESS: {type: String},
		IP: {type: String, required: true},
		BROWSER: {type: String, required: true},
		DATE: {type: Date, default: Date.now}
	});
	mongoose.model('Log', logSchema);
};