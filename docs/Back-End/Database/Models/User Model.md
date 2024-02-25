
Represents a user entity on the platform.

![[Pasted image 20240224163435.png]]

#### id
__Defaults to__: UUID (natural function)
__Type__: String

Unique ID in the table. Index of Model

#### username
__Type__: String

Unique username in the table. Compound index of Model

#### name
__Type__: String
Name of user

#### userData
__Type__: [[UserData Model]]

#### posts
__Type__: Array of [[Post Model]]

#### viewedPosts
__Type__: Array of [[ViewedPost Model]]

#### likedPosts
__Type__: Array of [[LikedPost Model]]

#### friends
__Type__: Array of [[Friendship Model]]
__Relation__: [[Friendship Model#userOne]]

#### friendshipsReceived
__Type__: Array of [[Friendship Model]]
__Relation__: [[Friendship Model#userTwo]]

#### following
__Type__: Array of [[Follow Model]]
__Relation__: "Following"

#### followers
__Type__: Array of [[Follow Model]]
__Relation__: "Follower"

#### chatroomUsers
__Type__: Array of [[ChatroomUser Model]]

#### avgRatio
__Type__: Float
__Default__: 0.0

The avgRatio attribute of a User relates to their performance on the platform. It comes as the result of a combination of factors such as post count

#### multiplier
__Type__: Float
__Default__: 1.0

Backbone for potential stream of revenue by using it to promote posts in a user's feed.

#### socket
__Type__: String
Currently connected, or last used socket ID

#### Message
__Type__: Array of [[Message Model]]

#### lastUpdated
__Defaults to__: now()
__Type__: DateTime

Last time the model was updated
