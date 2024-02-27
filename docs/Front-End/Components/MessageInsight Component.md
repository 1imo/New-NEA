
The MessageInsight Components provides high-level insights into a chatroom. It can be found on the [[PAGE - MessageList]] and has potential to be reused in a notification system.


### Analysis

Messaging is a crucial part of communication, especially on the platform. One of the benefits of messaging is that it is an asynchronous action where the sender has to wait for the recipient's response. Users should be able to see the last message, whether they have read the last message and information about the other party in a chatroom without even entering the chat.


### Design

#### Props

![[Pasted image 20240225170839.png]]


### Processing

To facilitate in the correct display, the component must work out who the message comes from. We do this by checking against the user's own ID. In future this will have to be refactored if chat groups will become a thing unless a chatroom name is explicitly specified.

```
const recipient = props?.data?.chatroomUsers?.find(chatter => chatter.id !== Ctx.id)
```

Then the format of time is decided. If a Chatroom was last updated more than a day ago, instead of the time, the date will be displayed.

```
const date = new Date(props?.data?.lastMessage?.date)
const currentDate = new Date()
const differenceInDays = Math.abs(currentDate.getDate() - date.getDate())
const formattedDate = differenceInDays < 1 ?
date.toLocaleTimeString('en-US', { minute: '2-digit', hour: '2-digit' }) :
date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
```

Finally, it is decided whether to show an unread notification if the chatroom has not been entered yet. The user can still see a preview of the last message without entering the chat.

```
const read = props?.data?.lastMessage?.read ? {display: "none"} : null
```

![[Pasted image 20240225171558.png]]

#### UI

![[Pasted image 20240225171747.png]]


### Tests

#### Test Case 1: Rendering Message Insight

Procedure:
1. Render the `MessageInsight` component with props containing relevant data.
2. Verify that the recipient's name, last message content, and timestamp are displayed correctly.
3. Check if clicking on the message insight navigates to the corresponding chatroom or user profile page.

Expected Result:
- The recipient's name, last message content, and timestamp should be displayed accurately.
- Clicking on the message insight should navigate to the corresponding chatroom or user profile page.