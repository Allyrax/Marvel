ComicApp.User = DS.Model.extend({
	username: DS.attr('string'),
	email: DS.attr('string'),
	password: DS.attr('string'),
	comics: DS.hasMany('comic'),
});