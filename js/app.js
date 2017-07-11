const express = require('express');
const config = require('./config');
const Twit = require('twit');
const bodyParser = require('body-parser');
const io = require('socket.io');
const T = new Twit(config);
const app = express();
let username = '@';
let friends;
let myInfo = [];
let tweetInfo = [];
let dmInfo = [];
let friendsInfo = [];

function personal(screenName, numOfFriends, bgImage) {
	this.name = screenName;
	this.friends = numOfFriends;
	this.image = bgImage;
}

function tweet(name, screenName, content, imageUrl, retweets, favorites, time) {
	this.profileName = name;
	this.username = screenName;
	this.text = content;
	this.image = imageUrl;
	this.retweets = retweets;
	this.favorites = favorites;
	this.time = time;
}

function followers(name, screenName, imageUrl) {
	this.profileName = name;
	this.screenName = screenName;
	this.image = imageUrl;
}

function dm(name, content, imageUrl, time) {
	this.profileName = name;
	this.text = content;
	this.image = imageUrl;
	this.time = time;
}

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.get('/error', (req, res) => {
	res.render('error');
});

app.get('/', (req, res) => {
	res.render('layout', {myInfo, friendsInfo, tweetInfo, dmInfo });
});

app.use('/static', express.static('public'));

T.get('account/verify_credentials', { skip_status: true })
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function (result) {
  	let myName = `@${result.data.screen_name}`;
    let myFriends = parseInt(result.data.friends_count);
    let bgImage = result.data.profile_background_image_url;
    myInfo= new personal(myName, myFriends, bgImage)
  });

T.get('friends/list', function(err, data, res) {
	for (let i = 0; i < 5; i++) {
		let friendsName = data.users[i].name;
		let friendsScreenname = data.users[i].screen_name;
		let friendsImage = data.users[i].profile_image_url;

		friendsInfo.push(new followers(friendsName, friendsScreenname, friendsImage));
	}
});

function updateTweets() {
	T.get('statuses/user_timeline', {screenName: username, count : 5}, function(err, data, res) {
		for (let i = 0; i < 5; i++) {
			let tweetContent = data[i].text;
			let tweetName = data[i].user.name;
			let tweetScreename = data[i].user.screen_name;
			let tweetImageUrl = data[i].user.profile_image_url; 
			let tweetRetweetCount = data[i].retweet_count;
			let tweetFavoriteCount = data[i].favorite_count;
			let tweetTimer = new Date(data[i].created_at).toLocaleString();
			tweetInfo.unshift(new tweet(tweetName, tweetScreename, tweetContent, tweetImageUrl, tweetRetweetCount, tweetFavoriteCount, tweetTimer));
		}
	});
}

T.get('statuses/user_timeline', {screenName: username, count : 5}, function(err, data, res) {
		for (let i = 0; i < 5; i++) {
			let tweetContent = data[i].text;
			let tweetName = data[i].user.name;
			let tweetScreename = data[i].user.screen_name;
			let tweetImageUrl = data[i].user.profile_image_url; 
			let tweetRetweetCount = data[i].retweet_count;
			let tweetFavoriteCount = data[i].favorite_count;
			let tweetTimer = new Date(data[i].created_at).toLocaleString();
			tweetInfo.push(new tweet(tweetName, tweetScreename, tweetContent, tweetImageUrl, tweetRetweetCount, tweetFavoriteCount, tweetTimer));
		}
	});

T.get('direct_messages', {count : 5}, function(err, data, res) {
	for (let i = 0; i < 5; i++) {
		let dmContent = data[i].text;
		let dmName = data[i].sender.name;
		let dmImageUrl = data[i].sender.profile_image_url;
		let dmTime = data[i].created_at;

		dmInfo.push(new dm(dmName, dmContent, dmImageUrl, dmTime));
	}
});

app.post('/', (req, res) => {
	let tweetMessage = req.body.name;
	T.post('statuses/update', {status: tweetMessage}, function(err, data, res) {
		res.redirect('/');
	});
});

let stream = T.stream('users');
stream.on('tweet', function(stream) {
  stream.on('data', function (data) {
    io.sockets.emit('tweet', data.text);
    console.log(data);
  });
  console.log('stream on')
});
      
setInterval(updateTweets, 1000);

app.listen(3000);
//console.log();
//

