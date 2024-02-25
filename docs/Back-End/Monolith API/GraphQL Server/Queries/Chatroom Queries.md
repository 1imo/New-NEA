
Since chatting between users is a real-time activity which relies on [[INDEX - Web Socket Server]], there is only the need to fetch user chats on page load to the messages pages.


### getChats

Returns all of a users chats to them - for their message screen.

Returns: List of [[Chatroom Type]]

![[Pasted image 20240223183533.png]]

```plaintext
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

