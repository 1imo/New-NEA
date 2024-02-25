
__Path__: /messaging/{:id}
__Intention__: Interface to chatrooms between users


### External Components Used

- [[Loading Component]]

![[Pasted image 20240225001605.png]]

![[Pasted image 20240225001759.png]]


### On First Render

Data is fetched from [[User Queries#getChatroomData]]

Whilst loading, [[Loading Component]] is displayed.

Auth is fetched from [[INDEX - Context]] and the chatID refers to the URL parameter ID in order to fetch the data of the chatroom. If there is an error an alert is displayed.

```
Call GET_CHATROOM_DATA function:
    Parameters:
        id = AuthUserID
        secretkey = AuthSecretKey
        chatId = ChatRoomID
```

```
if(error) alert("Error Loading Chatroom Data")
```

Then the MsgStore held in [[INDEX - Context]] is cleared as this is a new chat. At the time I didn't know that I could use React Refs to reference data so as to make data persistent across re-renders and had to do that this way. In the future for cleaner code, I would go about it a different way.

When the data is received, the users of the [[Chatroom Type]] are analysed to see the other party and set them in the UI.

```
setRecipient(data?.getChatroomData?.chatters.find(us => us.id !== Ctx.id))
```

Finally listeners are setup to handle incoming real-time data.

```
Function handleChatroom(data):
    If data.sender.id is not equal to Ctx.id:
        Call edit("read", data.id) to "read" the message because it has been "seen"
    Append data to prevMsgStore
    Append data to prevMessages

Function handleUpdatedChat(data):
    Update the last element of prevMessages with data
    Return the updated prevMessages array

When the component mounts:
    Listen for "chatroom" event on socket:
        When the event is received:
            Call handleChatroom with the received data
            
    Listen for "updatedChat" event on socket:
        When the event is received:
            Call handleUpdatedChat with the received data

Cleanup:
    When the component unmounts:
        Stop listening for "chatroom" event on socket
        Stop listening for "updatedChat" event on socket
```

![[Pasted image 20240224234651.png]]


### Code Body

##### Rendering Bottom-Up
Because the latest messages are at the bottom of the list, the message container has to be shown from the bottom first.

```
const messageContainer = document.querySelector('.message-container')

messageContainer.scrollTop = messageContainer.scrollHeight
```


##### Viewing Message Functionality
Instead of using Intersection Observers to monitor whether an element is in the viewport, I opted for an external package called [[React-Intersection-Observer]] so as to abstract the process. It works by checking to see whether the latest message that is in the viewport is in view and when true, send a signal to [[Chatroom Mutations#editMessage]].

```
Call useMutation function to edit a message:
    Parameters:
        Mutation: EDIT_MESSAGE

Call the edit function with parameters:
    Parameter 1: "read"
    Parameter 2: ID of the last message in the messages array

Inside the edit function:
    Call editMessage mutation with parameters:
        id: Ctx.id
        secretkey: Ctx.secretkey
        edit: "read"
        chatroom: id
        message: ID of the last message in the messages array
```

If there is an error during this process, an alert will be shown. It is rather vague because there is existing infrastructure to allow for deleting chats whilst still following DRY principles but this is for future scaling.

```
if(errorMain) alert("Error Editing Chat")
```


##### Send a Message
Sending a message is done by pressing the send button, collecting the input text and shuttling it across to the [[Chatroom Mutations#sendMessage]]. This is the last place I haven't done any input validation or sanitation but for now it is fine because that is set up on the [[INDEX - Security#Data Validation & Sanitation]].

If value is null, a redundant call isn't made to the API, and if request completes, the input box is emptied for a better user experience.

```
Define an asynchronous function named send:

    Check if the value of the contentRef is an empty string:
        If true, return without performing any further actions

    Call the sendMessage function asynchronously with parameters:
        id: Ctx.id
        secretkey: Ctx.secretkey
        content: Value of the contentRef
        chatroom: id

    Set the value of the contentRef to an empty string
```

![[Pasted image 20240225001933.png]]


### UI

##### Mobile

![[Pasted image 20240225002614.png]]


##### Desktop

![[Pasted image 20240225002543.png]]