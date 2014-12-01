ComicApp.Marvel = DS.Model.extend({
	comicId: DS.attr('number'),
	title: DS.attr('string'),
	issueNumber: DS.attr('number'),
	description: DS.attr('string'),
	pageCount: DS.attr('number'),
	url: DS.attr('string'),
	thumbnail: DS.attr('string')
});

ComicApp.Marvel.FIXTURES = [
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
