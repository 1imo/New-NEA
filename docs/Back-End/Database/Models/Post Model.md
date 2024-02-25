
Represents a post.

![[Pasted image 20240224171317.png]]

#### id
__Type__: Int
__Default__: autoincrement()

Unique and auto-increments to allow for intentional sharing of posts.

#### content
__Type__: String

Text body of the post. For now restrictions keep user input at around 100 chars

#### photo
__Type__: Boolean
__Default__: false

Shows whether there is media associated with the post and whether to fetch it from [[Image Server]]

#### user
__Type__: User
__Fields__: [[#userId]]
__References__: [[User Model#posts]]

#### userId
__Type__: String

#### date
__Type__: DateTime
__Default__: now()

Date & time posted/ created

#### likedBy
__Type__: Array of [[LikedPost Model]]
__Relation__: One-to-Many

#### viewedBy
__Type__: Array of [[ViewedPost Model]]
__Relation__: One-to-Many

#### avgRatio
__Type__: Float
__Default__: 0.0

Performance indicator of the post

#### multiplier
__Type__: Float
__Default__: 1.0

Specific performance enhancing boost, able to be boosted by a user in the future if revenue is needed.