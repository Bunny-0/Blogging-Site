# Blogging-Site''

Backend System
Stack: Node, Express, MongoDB


Do’s:
API’s should send JSON response (status, message, data)
API’s should be rate limited - 500ms = 2hits/sec


MVC - Model(Classes, Schemas), Views, Controller(Routes)

Version 1: 

Authentication (Session based auth) - JWT / Express-Session 
Register - email(unique), username(unique), password, name
Login - email/username, password
Logout
Logout from all devices
Create Tweet
Only text data
Limit of characters to 1000 max - Send error for limit exceeded
DB Schema should store the creation_datetime and user_details of the user who tweeted it
Schema - {title, text, creation_datetime, userId}
Home Page
All the tweets in descending order of time
Paginate the API (Limit - 20) (see more or scroll - Frontend)
My Tweets
All my tweets in descending order of time
Paginate the API (Limit 10)
User Profile 
Details of user
Tweets created by user
Edit Tweet 
Edit can only happen until 30 mins from tweeting
Delete Tweet
Allows users to delete tweets anytime

Database Collection/Tables:
User Details
Tweets
Sessions


Follow Up Tasks: Version 2 
	
Follow(Create): Allows users to follow other user
DB entry following_user: userId, follower: myUserId, creation_datetime
Followers List (Read) - following_user: userId - Pagination
Following List (Read) - follower: userId - Pagination
Unfollow - Deletes the follow entry from db - follower: userId 
Customized Feed Based on Follow
Bin - Done
Delete should not delete the item, it should move it to the bin
isDeleted: true, deletion_datetime: time of deletion
Update the read api’s to check for isDeleted: true
Cron to delete the deleted tweets from db - Everyday to delete 30 days old tweets


Database:
Follow

Advanced Features:
Hashtags
Array of 30 chars string stored in tweets schema - 20 hashtags at max
Trending (Top 10)
Tweets on a particular hashtag being used most in last 3 hrs
Like reaction on Tweets
Like reaction 
Laugh, support, celebrate reaction on tweets - Tweet schema will have a laughReaction, likeReaction keys /  {type: laugh/like, tweetId, userId}
Comments
Notifications 
Single Notification
Clubbed Notification
Direct Messaging using Socket.io
Bookmarks
Search

List of NPM Libraries to be used:
express
Mongodb
Mongoose
Express-session
Connect-mongodb-session
Bcrypt / md5
Validator
socket.io

Frontend System
Stack: React, Redux, HTML, CSS

Accessibility
Code-Splitting
Context
Error Boundaries
Forwarding Refs
Fragments
Higher-Order Components
Optimizing Performance
Profiler
React Without ES6
React Without JSX
Reconciliation
Refs and the DOM


Backend Changes
Storage - File and Database 
Client Server Architecture 
Horizontal Scaling DB
Vertical Scaling DB
Hosting of application on cloud - Heroku
Pagination 
Rate Limiting 
Webhooks
Cron
Database Sharding, Archiving, Indexing
 Caching DB - Redis, Dynamo DB 
 Pooling
