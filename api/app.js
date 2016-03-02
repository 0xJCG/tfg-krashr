var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require('mongoose');

// Connection to DB
mongoose.connect('mongodb://localhost/KRASHR', function(err, res) {
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
var logModel = require("./models/log.js")(app,mongoose);
var userController = require("./controllers/userController.js");
var resultController = require("./controllers/resultController.js");
var coreController = require("./controllers/coreController.js");

// Router options
var router = express.Router();
app.use(router);

router.route('/signin').post(userController.signIn);
router.route('/signup').post(userController.signUp);
router.route('/updateprofile').post(userController.updateUserInfo);
router.route('/updatepassword').post(userController.updatePassword);
router.route('/getprofile').post(userController.getUserInfo);
router.route('/removeuser').post(userController.removeUser);

router.route('/results/:process').post(resultController.getResult);
router.route('/results').post(resultController.getResults);
router.route('/nresults').post(resultController.getNumberResults);
router.route('/currentresult').post(resultController.getCurrentResult);
router.route('/search').post(resultController.search);

router.route('/saveresult').post(coreController.saveResult);

// Starting server
app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});
