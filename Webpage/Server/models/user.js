exports = module.exports = function(app,mongoose) {
	var Schema = mongoose.Schema;
	var userSchema = new Schema({
		USERNAME: {type:String, required:true},
		PASSWORD: {type:String, required:true},
		EMAIL: {type:String, required:true},
		NAME: {type:String},
		LASTNAME: {type:String},
		BIRTH_DATE: {type:Date},
		TYPE: {type:Number, max:3, default:1},
		RESULTS: [{type:Schema.Types.ObjectId, ref:'Result', required:true}]
		});
	mongoose.model('User',userSchema);
};