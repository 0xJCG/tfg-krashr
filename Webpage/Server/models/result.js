exports = module.exports = function(app, mongoose) {
	var Schema = mongoose.Schema;
	var resultSchema = new Schema({
		PROCESS: {type: String, required: true},
		WEB: {type: String, required: true},
		VULNERABILITY: {type: String, required: true},
		CURRENT: {type: Boolean},
		USER: {PROCESS: {type:Schema.Types.ObjectId, ref:'User', required:true}}
		});
	mongoose.model('Result', resultSchema);
};