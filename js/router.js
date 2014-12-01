ComicApp.Router.map(function () {
	this.resource('comics', { path: '/' });
	this.resource('comic', { path: '/comic/:comic_id' });
	this.resource('comicReview', { path: '/comicReview/:comic_id' });
	this.route('login');
	this.route('signup');
	this.route('user');
	this.route('marvelSearch');
});

ComicApp.ComicsRoute = Ember.Route.extend({
	model: function () {
		return $.getJSON("http://198.100.155.100:9001/comic")
	},
	
	renderTemplate: function() {
		this.render({ outlet: 'comic' });
	}
});

ComicApp.ComicReviewRoute = Ember.Route.extend({
	model: function (params) {
		return $.getJSON("http://198.100.155.100:9001/comic/"+params.comic_id)
	},
	
	renderTemplate: function() {
		this.render({ outlet: 'comic' });
	},
	
	redirect: function(params) {
        this.transitionTo('comic', params.comic_id);
    }
});

ComicApp.ComicRoute = Ember.Route.extend({
	model: function (params) {
		return $.getJSON("http://198.100.155.100:9001/userReview/"+params.comic_id)
	},
	
	renderTemplate: function(params) {
		this.render({ outlet: 'container' });
	}
});

ComicApp.LoginRoute = Ember.Route.extend({
	setupController: function(controller, context) {
		controller.reset();
	},
	
	renderTemplate: function() {
		this.render({ outlet: 'comic' });
	}
});

ComicApp.UserRoute = Ember.Route.extend({
	model: function() {
		return $.getJSON("http://198.100.155.100:9001/comic")
	},
	
	renderTemplate: function() {
		this.render({ outlet: 'container' });
	}
});

ComicApp.MarvelSearchRoute = Ember.Route.extend({
	model: function() {
		return $.getJSON("http://198.100.155.100:9001/marvel/deadpool")
	},
	
	renderTemplate: function() {
		this.render({ outlet: 'container' });
	}
});