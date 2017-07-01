# Twitter-Interface

Set up a new Express project in the provided app.js file.
You will need to create the following files:
A package.json file that includes your project’s dependencies.
A Jade/Pug template file to display tweets and messages

Create a file called config.js.
Import this code into your app.js file to authenticate your application so you can request data from the Twitter API.

Make a Pug/Jade template for the main page. The template should have spaces for:
your 5 most recent tweets
your 5 most recent friends
your 5 most recent private messages
It should also include your personal Twitter name and profile image at the top of the screen.
Styling is not the important part of this project. Craft your template markup to take advantage of the CSS we’ve provided you. Knowing how to work with someone else’s styles is a very important skill as a full-stack developer. Pay attention to class names, inheritance, and so on. Try to avoid element types that are not used in the provided HTML and CSS files.


Using Node and Express, request the data you need from Twitter’s API, render it in your template, and send it to the client at the “/” route. Please avoid using Express generator to set up this project. It will be good practice to set up a simple Express app yourself!


Each rendered result must include all of the information seen in the sample layout:
*tweets -message content -# of retweets -# of likes -date tweeted
*friends -profile image -real name -screenname
*messages -message body -date the message was sent -time the message was sent
Note that you don’t have to display direct messages as a back and forth conversation. You only need to display the last 5 messages that were received, or the last 5 messages that were sent.


Make sure the application actually renders your correct Twitter information by running it on your local machine and comparing it to your recent Twitter activity.

Add a section to the bottom of your page that allows a user to post a new tweet.

Add an error page to your application, so that if anything goes wrong with your routes, the user will see a friendly message rendered, instead of the default error code.

Include your personal background image from Twitter as a background for the page header.