var request		= require('request');
var md5			= require('MD5');
var Comic = require('./models/comic.js');

module.exports = {
	marvelComics: function(res, query) {
		var ts = parseInt(Date.now() / 1000, 10);
		
		var limit = 20;
		
		var offset = 0;
		
		var pubkey = '60d04bc3a5a00562057f83bc42f4ad58';
		var privkey = '1b2dd1f9d0d6033490ed93fd094a77b4a6477a4e';
		
		request({
			url: 'http://gateway.marvel.com/v1/public/comics',
			json: true,
			qs: {
				ts: ts,
				apikey: pubkey,
				hash: md5(ts + privkey + pubkey),
				limit: limit || 20,
				offset: offset || 0,
				titleStartsWith: query,
				format:	'comic',
				formatType:	'comic',
				noVariants: 'true',
			}
		}, function(err, response) {
			if (err) {
				res.send('No results found');
				return;
			}
		
			if (response.statusCode !== 200) {
				res.send('No results found');
				return;
			}
			
			var formattedRes = {};

			formattedRes.data = response.body.data.results;
			formattedRes.meta = {
				offset: response.body.data.offset
				, limit: response.body.data.limit
				, total: response.body.data.total
				, count: response.body.data.count
			};
			
			var comics = {};
		  
			for (var i = 0; i < formattedRes.data.length; i++) { 
				newThumbnail = formattedRes.data[i].thumbnail.path + '/portrait_incredible.' + formattedRes.data[i].thumbnail.extension;
				newUrl = formattedRes.data[i].urls[0].url
			
				Comic.findOneAndUpdate(
					{'id': formattedRes.data[i].id},
					{
						id 			: formattedRes.data[i].id,
						title		: formattedRes.data[i].title,
						issueNumber	: formattedRes.data[i].issueNumber,
						description	: formattedRes.data[i].description,
						series 		: formattedRes.data[i].series,
						thumbnail 	: newThumbnail,
						url			: newUrl,
						done		: false
					},
					{upsert: true}, function(err, doc){
						
					});
				
				comics[i] = {
					id 			: formattedRes.data[i].id,
					title		: formattedRes.data[i].title,
					issueNumber	: formattedRes.data[i].issueNumber,
					description	: formattedRes.data[i].description,
					series 		: formattedRes.data[i].series,
					thumbnail 	: newThumbnail,
					pageCount	: formattedRes.data[i].pagecount,
					url			: newUrl
				};
			}
		
			res.send( formattedRes.data );
		
		});
	}
}