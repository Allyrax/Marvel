// app/routes.js
module.exports = function(app, passport) {
	
	var Comic = require('./models/comic.js');
	var UserReview = require('./models/userReview.js');
	var marvel = require('./marvel.js');
	var path = require('path');

	// Define a middleware function to be used for every secured routes
	var auth = function(req, res, next){
		if (!req.isAuthenticated())
			res.send(401);
		else next();
	};
	
	// route to test if the user is logged in or not
	app.get('/loggedin', function(req, res) {
		res.send(req.isAuthenticated() ? req.user : '0');
	});
	// route to log in
	app.post('/login', passport.authenticate('local-login'), function(req, res) {
		res.send(req.user);
	});
	
	// route to log in
	app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
		res.send(req.user);
    });
	
	// route to log out
	app.post('/logout', function(req, res){
		req.logOut(); res.send(200);
	});
	
	//comics
	app.get('/comic', auth, function(req, res) {
        // use mongoose to get all comics in the database
        Comic.find(function(err, comics) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(comics); // return all comics in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/comic', auth, function(req, res) {
	
        Comic.create({
            id 			: req.body.id,
			title		: req.body.title,
			issueNumber	: req.body.issueNumber,
			description	: req.body.description,
			series 		: req.body.series,
			thumbnail 	: req.body.thumbnail,
			pageCount	: req.body.pageCount,
			url			: req.body.url,
            done : false
        }, function(err, comic) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Comic.find(function(err, comics) {
                if (err)
                    res.send(err)
                res.json(comics);
            });
        });

    });
	
	app.get('/comic/:comic_id', auth, function(req, res) {
        // use mongoose to get all comics in the database
        Comic.find({ id: req.params.comic_id }, function(err, comic) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(comic[0]); // return all comics in JSON format
        });
    });

    // delete a todo
    app.delete('/comic/:comic_id', auth, function(req, res) {
        Comic.remove({
            _id : req.params.comic_id
        }, function(err, comic) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Comic.find(function(err, comics) {
                if (err)
                    res.send(err)
                res.json(comics);
            });
        });
    });
	
	//=============================================
	//User Reviews
	app.get('/userReview/:comic_id', auth, function(req, res) {
        // use mongoose to get all comics in the database
        UserReview.find({ comicId: req.params.comic_id }, function(err, userReview) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
			
			var response = {};
			
			response = userReview;
			
			res.json(response);

             // return all comics in JSON format
        });
    });
	
	app.get('/user/:user_id', auth, function(req, res) {
        // use mongoose to get all comics in the database
        UserReview.find({ user: req.params.user_id }, function(err, userReviews) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
			
			var response = {};
			
			if(userReviews != null)
				response = userReviews;
			
			res.json(response);

             // return all comics in JSON format
        });
    });
	
	app.get('/userReview/:user_id/:comic_id', auth, function(req, res) {
        // use mongoose to get all comics in the database
        UserReview.findOne({ user: req.params.user_id, comicId: req.params.comic_id }, function(err, userReview) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
			
			var response = {user: req.params.user_id,
							comicId: req.params.comic_id,
							pubReview: '',
							privReview: '',
							read: false,
							planToRead: false
							};
			
			if (userReview != null)
				response = userReview;
			
			res.json(response);

             // return all comics in JSON format
        });
    });
	
    app.post('/userReview', auth, function(req, res) {
		
		console.log( req.body.comicId + ' ' + req.body.user);
	
        UserReview.findOneAndUpdate(
			{'user': req.body.user,
			 'comicId' : req.body.comicId}, {
			user		: req.body.user,
			comicId     : req.body.comicId,
			pubReview	: req.body.pubReview,
			privReview	: req.body.privReview,
			read		: req.body.read,
			planToRead	: req.body.planToRead,
            done : false
        },{upsert: true}, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            UserReview.find({'comicId': req.body.comicId},function(err, userReview) {
                if (err)
                    res.send(err)
                res.json(userReview);
            });
        });

    });

    // delete a todo
    app.delete('/userReview/:user_id/:comic_id', auth, function(req, res) {
        UserReview.remove({
            user: req.params.user_id, comicId: req.params.comic_id
        }, function(err, userReview) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            UserReview.find(function(err, userReviews) {
                if (err)
                	res.json({status: 'Failure'});
                res.json({status: 'Removed'});
            });
        });
    });
	
	app.get('/marvel/:comic_id', auth, function(req, res) {
		
		var query = req.params.comic_id;
		
		marvel.marvelComics(res, query);
	});
	
	// =====================================
    // HOME PAGE (with login links) ========
    // =====================================
	 app.get('/test', function(req, res) {
		res.sendFile('test.html', { root: path.join(__dirname, '../public') });
		/*
		if (req.user) {
    		res.render('/index.html', {
            	user : req.user // get the user out of session and pass to template
        	});
		} else {
			// not logged in
			res.render('login.ejs', { message: req.flash('loginMessage') }); 
		}
		*/
    });
	
    app.get('*', function(req, res) {
		res.sendFile('index.html', { root: path.join(__dirname, '../public') });
		/*
		if (req.user) {
    		res.render('/index.html', {
            	user : req.user // get the user out of session and pass to template
        	});
		} else {
			// not logged in
			res.render('login.ejs', { message: req.flash('loginMessage') }); 
		}
		*/
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}// JavaScript Document