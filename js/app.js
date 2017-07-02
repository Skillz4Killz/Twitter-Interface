const express = require('express');
const config = require('./config');
const Twit = require('twit');
const T = new Twit(config);
const app = express();
let username = '@';
let friendsList = [];
let friendsUsername = [];
let friends;
let friendsPhotos = [];
let messageText = [];
let contact = [];
let messageTimes = [];


app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render('layout', {username, friends, friendsList, friendsUsername, friendsPhotos, messageText, contact, messageTimes });
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
    console.log(friends);
  });

T.get('friends/list', function(err, data, res) {
	for (let i = 0; i < 5; i++) {
		friendsList.push(data.users[i].name);
		friendsUsername.push(data.users[i].screen_name);
		friendsPhotos.push(data.users[i].profile_image_url);
		console.log(friendsPhotos);
	}
})

T.get('direct_messages/events/list', function(err, data, res) {
	if (!err) {
		for (let i = 0; i < 5; i++) {
			let messageContent = data.events[i].message_create.message_data.text;
			
			T.get('users/lookup', { user_id: data.events[i].message_create.target.recipient_id}, function(err, data, res) {
				if (data[0].screen_name == username) {
					//do nothing	
				} else {
					contact.push(data[0].screen_name);
				}	
			});
			T.get('users/lookup', { user_id: data.events[i].message_create.sender_id}, function(err, data, res) {
				if (data[0].screen_name == username) {
					//do nothing	
				} else {
					contact.push(data[0].screen_name);
				}
			});
			messageText.push(messageContent);
			let time = new Date(parseInt(data.events[i].created_timestamp)).toLocaleString();
			messageTimes.push(time);

		}
	} else {
		console.log(`Error # ${err.code} : ${err.message}`)
	}
})

app.listen(3000);
//console.log();

