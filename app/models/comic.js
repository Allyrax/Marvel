// app/models/comic.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var comicSchema = mongoose.Schema({
	
	id				: Number,
	title       	: String,
	issueNumber		: Number,
	description		: String,
	series 			: String,
	thumbnail 		: String,
	pageCount		: Number,
	url				: String	
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Comic', comicSchema);