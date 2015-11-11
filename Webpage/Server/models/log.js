exports = module.exports = function(app, mongoose) {
	var Schema = mongoose.Schema;
	var logSchema = new Schema({
		ID: {type:Schema.Types.ObjectId, ref:'Log', required:true},
		ACTION: {type:String, required:true},
		USERNAME: {type:String, required:true}
		});
	mongoose.model('Log', logSchema);
};