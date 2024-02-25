
Represents a one-way social connection between two users.

![[Pasted image 20240224165427.png]]
#### id
__Defaults to__: UUID
__Type__: String

Unique

#### follower
__Type__: [[Database/Models/User Model|User Model]]
__Relation__: [[#following]]
__Fields__: [[#followerId]]
__References__: [[User Model#id]]

#### followerId
__Type__: String

Unique

#### following
__Type__: [[Database/Models/User Model|User Model]]
__Relation__: [[#following]]
__Fields__: [[#followingId]]
__References__: [[User Model#id]] 

#### followingId
__Type__: String

Unique

#### denial
__Defaults to__: false
__Type__: Boolean

Represents the current state of the social connection

