var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require('mongoose');


// Connection to DB
mongoose.connect('mongodb://localhost/VULPIX', function(err, res) {
	if(err) throw err;
	console.log('Connected to Database');
});

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());

// Importing models and controllers
var userModel = require("./models/user.js")(app,mongoose);
var resultModel = require("./models/result.js")(app,mongoose);
var userController = require("./controllers/userController.js");
var resultController = require("./controllers/resultController.js");

// Router options
var router = express.Router();
app.use(router);

router.route('/login').post(userController.signIn);
router.route('/signup').post(userController.signUp);
router.route('/user').post(userController.updateUserInfo);
router.route('/changepass').post(userController.updatePassword);

router.route('/results/:process').post(resultController.getResult);
router.route('/results').post(resultController.getAllResults);

// Starting server
app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});
