exports = module.exports = function(app, mongoose) {
	var Schema = mongoose.Schema;
	var resultSchema = new Schema({
		PROCESS: {type:Schema.Types.ObjectId, ref:'Result', required:true},
		WEB: {type:String, required:true},
		USER: String
		});
	mongoose.model('Result', resultSchema);
};