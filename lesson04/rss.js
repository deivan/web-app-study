var feed = require('feed-read-parser');

feed('http://craphound.com/?feed=rss2', function(err, articles){
	if(err) throw err;

	//for(i=0, l=articles.length; i<l; i++){
		console.log(articles[0]);
	//}
});