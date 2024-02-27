
__Path__: /messaging
__Intention__: To show the user their chats and chatrooms


### External Components Used

- [[MessageInsight Component]]

![[Pasted image 20240224225402.png]]


### Analysis

Users can have multiple ongoing chats, even at the same time. To design an interface for them, we must be aware that chats update in real-time and we should give them the option to start a new chat too with a new chat button. The interface must be response and intuitive as well as follow the overall them of the front-end.


### Design

#### On First Render

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


#### Messages

Messages are displayed in a vertical list, newest first, in a [[MessageInsight Component]]. If none are found, the user is made aware by telling them that there are no messages.


#### Creating a new Chatroom

To create a new [[Chatroom Model]], the follow the [[Chatroom Creation]] workflow.


#### UI

##### Mobile

![[Pasted image 20240226220702.png]]


##### Desktop

![[Pasted image 20240224230259.png]]

![[Pasted image 20240224230350.png]]


### Tests

#### Test Case 1: Rendering and Display

**Procedure:**
1. Render the `MessageList` component.
2. Observe the displayed content.

**Expected Result:**
- The component should render without crashing.
- The component should display a navigation bar with a title "Messages" and a button/icon for creating a new message.
- If there are messages available, they should be displayed in the message list.
- If there are no messages available, a message indicating "No Messages" should be displayed.

#### Test Case 2: Creating New Chat

**Procedure:**
1. Render the `MessageList` component.
2. Click or tap the button/icon for creating a new message.

**Expected Result:**
- Upon clicking or tapping the button/icon for creating a new message, the user should be navigated to the search page with the search type set to "message".
- The user should be able to initiate a new chat with another user or group.

#### Test Case 3: Loading Chats

**Procedure:**
1. Render the `MessageList` component.
2. Observe the loading process.

**Expected Result:**
- The component should display a loading indicator while loading chats.
- Once the chats are loaded, they should be displayed in the message list.

#### Test Case 4: Handling Errors

**Procedure:**
1. Render the `MessageList` component.
2. Simulate an error during the loading of chats.

**Expected Result:**
- If an error occurs during the loading of chats, an error alert should be displayed.
- The component should gracefully handle errors without crashing.