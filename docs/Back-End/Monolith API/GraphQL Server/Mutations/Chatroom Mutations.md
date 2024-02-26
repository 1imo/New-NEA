
Changes in data with regards to messages and user chatrooms.

### getLocation

Resolver that creates a new chatroom on request with another user.

Sockets: [[INDEX - Web Socket Server#updatedChat]]

Returns: [[Chatroom Type]]

#### Analysis

When a user creates a request to create a chatroom, there must be a way to interact from the user interface all the way back to the db and create a [[Chatroom Model]]. The user must then be redirected after successful completion towards the chatroom for feedback and UX purposes.

#### Design

```
Generate a unique chatroom id
Create a new chatroom with the generated id
Add userOne to the chatroom as a chatroom user
Add userTwo to the chatroom as a chatroom user
Return the chat id
```

```
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


#### Tests

##### Test Case 1: Create a new chatroom and add users

**Procedure:**
1. Generate a unique chatroom id using nanoid.
2. Create a new chatroom in the database with the generated id.
3. Add userOne to the chatroom as a chatroom user.
4. Add userTwo to the chatroom as a chatroom user.

**Expected Result:**
1. A unique chatroom id is generated successfully.
2. A new chatroom record is created in the database with the generated id.
3. UserOne is added to the chatroom as a chatroom user.
4. UserTwo is added to the chatroom as a chatroom user.

##### Test Case 2: Retrieve created chatroom

**Procedure:**
1. Retrieve the created chatroom from the database using the generated id.
2. Verify that the retrieved chatroom exists and contains userOne and userTwo as chatroom users.

**Expected Result:**

1. The created chatroom is successfully retrieved from the database.
2. The retrieved chatroom contains userOne and userTwo as chatroom users.

##### Test Case 3: Emit 'updatedChat' event to userOne's socket

**Procedure:**
1. Simulate the emission of an 'updatedChat' event to userOne's socket.
2. Verify that the event is emitted successfully.

**Expected Result:**
1. The 'updatedChat' event is emitted successfully to userOne's socket.


### sendMessage

The query which allows for the sending of messages between people and storing them in chatrooms for further retrieval in the future.

Socket: [[INDEX - Web Socket Server#updatedChat]]

Returns: [[Message Type]]


#### Analysis

Sending messages should be done through an API to ensure that messages are validated, sanitized and going to the correct place.


#### Design

```
Create a new message with provided content, senderId, and chatroomId
Emit a 'chatroom' event to all chatroom users' sockets with the message
```

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


#### Tests

##### Test Case: Create a new message and emit event to chatroom users

**Procedure:**
1. Authenticate the user using the provided id and secret key.
2. Retrieve the chatroom information, including chatroom users' sockets.
3. Create a new message with the provided content, senderId, and chatroomId.
4. Emit a 'chatroom' event to all chatroom users' sockets with the message.
5. Emit an 'updatedChat' event to all chatroom users' sockets with the message.

**Expected Result:**
1. User authentication is successful.
2. Chatroom information, including chatroom users' sockets, is retrieved successfully.
3. A new message is created with the provided content, senderId, and chatroomId.
4. The 'chatroom' event is emitted to all chatroom users' sockets with the new message.
5. The 'updatedChat' event is emitted to all chatroom users' sockets with the new message.


### editMessage

Opens up functionality for changing the state of a sent message such as read notifications plus unread functionality, deleting the message by overwriting the content so as to not worry about beautiful disappearing animations for the time being and infrastructure to build on to edit messages after they have been sent. I didn't consider the latter to be as important right now for the beta.

Sockets: [[INDEX - Web Socket Server#updatedChat]]

Returns: [[Link Type]]


#### Analysis

Messages can be interacted with and are not just `dead`, `unalive` means of transferring text. Reading, deleting and potentially editing should always be thought about when creating any form of messaging software.


#### Design

```
If edit action is 'read':
    Set msg.read to true
Else if edit action is 'unread':
    Set msg.read to false
Else if edit action is 'delete':
    Set msg.content to 'This message has been deleted'

Emit an 'updatedChat' event each user's socket with new message
```

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


#### Tests

##### Test Case 1: Edit Message - Mark as Read

**Procedure:**
1. Authenticate the user using the provided id and secret key.
2. Retrieve the chatroom information, including chatroom users' sockets.
3. Determine the edit action as 'read'.
4. Prepare update data to set msg.read to true.
5. Update the message in the database with the prepared update data.
6. Emit an 'updatedChat' event to each user's socket with the updated message.

**Expected Result:**
1. User authentication is successful.
2. Chatroom information, including chatroom users' sockets, is retrieved successfully.
3. The edit action is correctly determined as 'read'.
4. Update data is prepared to set msg.read to true.
5. The message is successfully updated in the database with the updated read status.
6. An 'updatedChat' event is emitted to each user's socket with the updated message containing the read status set to true.


#### Test Case 2: Edit Message - Mark as Unread

**Procedure:**
1. Authenticate the user using the provided id and secret key.
2. Retrieve the chatroom information, including chatroom users' sockets.
3. Determine the edit action as 'unread'.
4. Prepare update data to set msg.read to false.
5. Update the message in the database with the prepared update data.
6. Emit an 'updatedChat' event to each user's socket with the updated message.

**Expected Result:**
1. User authentication is successful.
2. Chatroom information, including chatroom users' sockets, is retrieved successfully.
3. The edit action is correctly determined as 'unread'.
4. Update data is prepared to set msg.read to false.
5. The message is successfully updated in the database with the updated read status.
6. An 'updatedChat' event is emitted to each user's socket with the updated message containing the read status set to false.


#### Test Case 3: Edit Message - Delete Message Content

**Procedure:**
1. Authenticate the user using the provided id and secret key.
2. Retrieve the chatroom information, including chatroom users' sockets.
3. Determine the edit action as 'delete'.
4. Prepare update data to set msg.content to 'This message has been deleted'.
5. Update the message in the database with the prepared update data.
6. Emit an 'updatedChat' event to each user's socket with the updated message.

**Expected Result:**
1. User authentication is successful.
2. Chatroom information, including chatroom users' sockets, is retrieved successfully.
3. The edit action is correctly determined as 'delete'.
4. Update data is prepared to set msg.content to 'This message has been deleted'.
5. The message is successfully updated in the database with the message content deleted.
6. An 'updatedChat' event is emitted to each user's socket with the updated message containing the message content set to 'This message has been deleted'.