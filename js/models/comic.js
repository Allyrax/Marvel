ComicApp.Comic = DS.Model.extend({
	comicId: DS.attr('number'),
	user: DS.belongsTo('user'),
	publicComment: DS.attr('string'),
	privateComment: DS.attr('string'),
	read: DS.attr('boolean'),
	planToRead: DS.attr('boolean')
});

ComicApp.Comic.FIXTURES = [
  {
    id: 1,
	title: 'Deadpool',
	issueNumber: 39,
	description: 'Deadpools attack on Xina',
	pageCount: 32
	//urls: DS.hasMany('url'),
	//thumbnail: DS.hasMany('thumbnail')
 },
 {
	id: 2,
	title: 'Deadpool',
	issueNumber: 39,
	description: 'Deadpools attack on Xina',
	pageCount: 32
	//urls: DS.hasMany('url'),
	//thumbnail: DS.hasMany('thumbnail')
 },
 {
	id: 3,
	title: 'Deadpool',
	issueNumber: 39,
	description: 'Deadpools attack on Xina',
	pageCount: 32
  }
];
