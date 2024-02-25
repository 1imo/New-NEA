
Represents a message in a [[Chatroom Model]].

![[Pasted image 20240224172918.png]]

#### id
__Type__: String
__Default__: uuid()

#### content
__Type__: String

#### sender
__Type__: [[User Model]]
__Fields__: [[#senderId]]
__References__: [[User Model#id]]

#### senderId
__Type__: String

#### date
__Type__: DateTime
__Default__: now()

#### read
__Type__: Boolean
__Default__: false

#### chatroom
__Type__: [[Chatroom Model]]
__Fields__: [[#chatroomId]]
__References__: [[Chatroom Model#id]]

#### chatroomId
__Type__: String
