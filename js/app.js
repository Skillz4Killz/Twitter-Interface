const express = require('express');
const config = require('./config');
const Twit = require('twit');
const T = new Twit(config);
const app = express();
let username = '@';
let friends;
let tweetInfo = [];
let dmInfo = [];
let friendsInfo = [];

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


app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render('layout', {username, friends, friendsInfo, tweetInfo, dmInfo });
	// button = document.getElementsByTagName('button');
	// messageInput = document.getElementsByTagName('input');

	// button.addEventListener('click', () => {

	// // 	T.post('statuses/update', {status}, function(err, data, res) {

	// // });
	// })
});

app.use('/static', express.static('public'));

T.get('account/verify_credentials', { skip_status: true })
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function (result) {
    username += result.data.screen_name;
    friends = result.data.friends_count;
    parseInt(friends);
  });

T.get('friends/list', function(err, data, res) {
	for (let i = 0; i < 5; i++) {
		let friendsName = data.users[i].name;
		let friendsScreenname = data.users[i].screen_name;
		let friendsImage = data.users[i].profile_image_url;

		friendsInfo.push(new followers(friendsName, friendsScreenname, friendsImage));
	}
});

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


// T.get('direct_messages/events/list', function(err, data, res) {
// 	if (!err) {
// 		for (let i = 0; i < 5; i++) {
// 			let messageContent = data.events[i].message_create.message_data.text;
			
// 			T.get('users/lookup', { user_id: data.events[i].message_create.target.recipient_id}, function(err, data, res) {
// 				if (data[0].screen_name == username) {
// 					//do nothing	
// 				} else {
// 					contact.push(data[0].screen_name);
// 				}	
// 			});
// 			T.get('users/lookup', { user_id: data.events[i].message_create.sender_id}, function(err, data, res) {
// 				if (data[0].screen_name == username) {
// 					//do nothing	
// 				} else {
// 					contact.push(data[0].screen_name);
// 				}
// 			});
// 			messageText.push(messageContent);
// 			let time = new Date(parseInt(data.events[i].created_timestamp)).toLocaleString();
// 			messageTimes.push(time);

// 		}
// 	} else {
// 		console.log(`Error # ${err.code} : ${err.message}`)
// 	}
// })

app.listen(3000);
//console.log();

