
Changes in data with regards to messages and user chatrooms.

### getLocation

Resolver that creates a new chatroom on request with another user.

Sockets: [[INDEX - Web Socket Server#updatedChat]]

Returns: [[Chatroom Type]]

```plantuml
@startuml
[*] --> Unauthenticated

state Unauthenticated {
    [*] --> TryBlock
}

state TryBlock {
    --> Authenticated : success
    --> LoggedError : error
}

state Authenticated {
    --> FindingUserOne
}

state FindingUserOne {
    --> FindingUserTwo
}

state FindingUserTwo {
    --> GeneratingChatroomId
}

state GeneratingChatroomId {
    --> CreatingChatroom
}

state CreatingChatroom {
    --> AddingUserOne
    --> AddingUserTwo
}

state AddingUserOne {
    --> AddingUserTwo
}

state AddingUserTwo {
    --> FindingChatroom
}

state FindingChatroom {
    --> InitializingChatObject
}

state InitializingChatObject {
    --> EmittingUpdatedChatEvent
    --> ReturningChatObject
}

state EmittingUpdatedChatEvent {
    --> [*]
}

state LoggedError {
    --> [*]
}

state ReturningChatObject {
    --> [*]
}

@enduml
```

```plaintext
Define getLocation:
    Type: ChatroomType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        username:
            Type: String
    Resolve asynchronously:
        Try:
            Authenticate user using provided id and secretkey
            Find userOne in Prisma:
                Where id matches args.id
                Select id and socket
            Find userTwo in Prisma:
                Where username matches args.username
                Select id
            Generate a unique chatroom id using nanoid
            Create a new chatroom in Prisma with the generated id
            Add userOne to the chatroom as a chatroom user
            Add userTwo to the chatroom as a chatroom user
            Find the created chatroom in Prisma:
                Where id matches the generated id
                Select id and chatroomUsers
            Initialize a chat object with id, chatroomUsers, an empty messages array, and an empty lastMessage object
            Emit an 'updatedChat' event to userOne's socket with the chat object
            Return the chat object
        Catch error:
            Log error
            Return
```


### sendMessage

The query which allows for the sending of messages between people and storing them in chatrooms for further retrieval in the future.

Socket: [[INDEX - Web Socket Server#updatedChat]]

Returns: [[Message Type]]

![[Pasted image 20240223225202.png]]

```plaintext
Define sendMessage:
    Type: MessageType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        chatroom:
            Type: String
        content:
            Type: String
    Resolve asynchronously:
        Try:
            Authenticate user using provided id and secretkey
            Find chatroom in Prisma:
                Where id matches args.chatroom
                Include chatroomUsers with their sockets
            Find sender user in Prisma:
                Where id matches args.id
                Select id
            Create a new message in Prisma with provided content, senderId, and chatroomId
            Select id, sender id, sender username, sender name, content, date, and read status of the created message
            Emit a 'chatroom' event to all chatroom users' sockets with the message
            Emit an 'updatedChat' event to all chatroom users' sockets with the message
            Return the created message
        Catch error:
            Log error
            Return
```



### editMessage

Opens up functionality for changing the state of a sent message such as read notifications plus unread functionality, deleting the message by overwriting the content so as to not worry about beautiful disappearing animations for the time being and infrastructure to build on to edit messages after they have been sent. I didn't consider the latter to be as important right now for the beta.

Sockets: [[INDEX - Web Socket Server#updatedChat]]

Returns: [[Link Type]]

```plaintext
Define editMessage:
    Type: LinkType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        chatroom:
            Type: String
        message:
            Type: String
        edit:
            Type: String
    Resolve asynchronously:
        Try:
            Authenticate user using provided id and secretkey
            Find chatroom in Prisma:
                Where id matches args.chatroom
                Select chatroomUsers with their sockets
            Initialize an empty object updateData
            If edit action is 'read':
                Set updateData.read to true
            Else if edit action is 'unread':
                Set updateData.read to false
            Else if edit action is 'delete':
                Set updateData.content to 'This message has been deleted'
            If updateData is not empty:
                Update the message in Prisma:
                    Where id matches args.message
                    Update fields based on updateData
            For each user in chatroom:
                Emit an 'updatedChat' event to user's socket with updateData
            Return
        Catch error:
            Log error
            Return
```

![[Pasted image 20240223230825.png]]