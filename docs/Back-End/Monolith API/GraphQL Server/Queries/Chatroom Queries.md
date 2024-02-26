
Since chatting between users is a real-time activity which relies on [[INDEX - Web Socket Server]], there is only the need to fetch user chats on page load to the messages pages.


### getChats

Returns all of a users chats to them - for their message screen.

Returns: List of [[Chatroom Type]]


#### Analysis

Whilst the chatting feature is delegated to the socket server because it happens in real-time, the initial data must be fetched from an endpoint on initial load.


#### Design

![[Pasted image 20240223183533.png]]

```
Define getChats:
    Type: List of ChatroomType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
    Resolve asynchronously:
        Try:
            Sanitise args
            Authenticate user with provided id and secret key
            Fetch chatrooms from Prisma:
                Where user id equals args.id
                Select chatroom details including users and last message
            Extract insights from chatrooms:
                For each chatroom user:
                    Retrieve chatroom and last message
                    Extract recipients from chatroom users
                    Push chatroom insight to insights array
            Return insights
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Retrieve User's Chatrooms

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Call the `getChats` resolver with the user's ID and secret key.

**Expected Result:**
- The resolver should return a list of chatroom insights, each containing the chatroom ID, chatroom users, and last message.
- The chatroom insights should include all chatrooms associated with the user.


##### Test Case 2: User with No Chatrooms

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Call the `getChats` resolver with the user's ID and secret key for a user who has no chatrooms.

**Expected Result:**
- The resolver should return an empty list since the user has no chatrooms associated with them.


##### Test Case 3: Invalid User Authentication

**Procedure:**
1. Provide invalid user ID and secret key.
2. Call the `getChats` resolver with the invalid user credentials.

**Expected Result:**
- The resolver should throw an error during authentication, indicating that the user credentials are invalid.