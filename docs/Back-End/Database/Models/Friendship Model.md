
Represents a mutual connection between two user entities.

![[Pasted image 20240224164606.png]]
#### id
__Defaults to__: UUID
__Type__: String

Unique Friendship ID

#### userOne
__Type__: User
__Relation__: [[Back-End/Database/Models/User Model|User Model]]
__Fields__: [[#userOneId]]
__References__: [[User Model#id]]

#### userOneId
__Type__: String

Unique ID that refers to a user

#### userTwo
__Type__: User
__Relation__: [[Back-End/Database/Models/User Model|User Model]]
__Fields__: [[#userTwoId]]
__References__: [[User Model#id]]

#### userTwoId
__Type__: String

Unique ID that refers to a user
