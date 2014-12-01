// app/models/comic.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userReviewSchema = mongoose.Schema({
	
	user			: String,
	comicId       	: Number,
	pubReview		: String,
	privReview		: String,
	read			: Boolean,
	planToRead		: Boolean,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('UserReview', userReviewSchema);