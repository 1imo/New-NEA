
__Path__: /messaging
__Intention__: To show the user their chats and chatrooms


### External Components Used

- [[MessageInsight Component]]

![[Pasted image 20240224225402.png]]


### On First Render

A user's chats are requested from [[Chatroom Queries#getChats]] on load.

```
Call GET_CHATS function:
    Parameters:
        id = AuthUserID
        secretkey = AuthSecretKey
```

Feedback whilst loading and if errors occur during the fetch process.

```
if(error) alert("Error Loading Chats")

if(loading) return <Loading />
```

Sockets are also set up to accommodate for potential incoming data and then unmounted when the component finishes in order to prevent memory leaks.

```
When the component mounts:
    Listen for the "getChats" event on the socket:
        When the event is received:
            Update the chats state with the received data

    Listen for the "updatedChat" event on the socket:
        When the event is received:
            Emit the "getChats" event on the socket with the user ID and secret key as payload

    Clean up (when the component unmounts):
        Stop listening for the "getChats" event
        Stop listening for the "updatedChat" event

```

![[Pasted image 20240224223028.png]]

![[Pasted image 20240224225451.png]]


### Messages

Messages are displayed in a vertical list, newest first, in a [[MessageInsight Component]]. If none are found, the user is made aware by telling them that there are no messages.


### Creating a new Chatroom

To create a new [[Chatroom Model]], the follow the [[Chatroom Creation]] workflow.


### UI

##### Mobile

![[Pasted image 20240224230200.png]]

![[Pasted image 20240224230213.png]]


##### Desktop

![[Pasted image 20240224230259.png]]

![[Pasted image 20240224230350.png]]