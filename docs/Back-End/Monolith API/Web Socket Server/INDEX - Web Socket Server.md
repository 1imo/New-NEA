
Web sockets are a key technology for enabling real-time, bidirectional communication between clients and servers over a single, long-lived connection. Unlike traditional HTTP requests, which are stateless and typically involve separate connections for each request/response cycle, web sockets provide a persistent connection that allows data to be transmitted in both directions instantaneously. This capability is crucial for applications requiring live updates, such as chat applications, online gaming platforms, stock market tickers, and collaborative document editing tools. Web sockets leverage the WebSocket protocol, which operates over TCP and is standardized by the Internet Engineering Task Force (IETF) as RFC 6455.

To implement web sockets in a I chose to use the [[Socket.io]] library due to it's functionality. Out of the box it has support for re-connection attempts in the case that a client loses connection. Since this is a social media platform, it is likely that a user will encounter temporary network issues from time to time whilst out and about. I went with 5, spaced 1000ms apart.


### True User

Using the socket and the IDs of it's connected clients, I have created user sessions by first sanitizing and authenticating [[INDEX - Security]] the user, and then going on to store the user id in the database. Whilst typical session concepts tend to store the ID's in hash maps or dictionaries in memory or in JSON files, attaching the information to HTTP responses, for now I decided to go with this approach because I can trust in sockets for extremely fast, real time updates.

```plaintext
Function handleInitialConnection(socket, data):
    Try:
        // Sanitize incoming data
        sanitizedData = sanitise(data)

        // Authenticate user
        exists = await authenticateUser(sanitizedData.id, sanitizedData.secretkey)

        If user does not exist:
            // Send authentication failure message to client
            Emit 'auth' event with value 'false' to socket
            Return

        Else:
            // Update user's socket ID in database
            Update user's socket ID in database using Prisma
            Emit 'auth' event with value 'true' to socket

    Catch any errors:
        Log the error

// Example usage
socket.on('initialConnection', async (data) => {
    handleInitialConnection(socket, data)
})
```

This is only triggered the first time a the app is loaded or when a client's cookies change because the functionality is stored in the client's [[INDEX - Context]] which is a wrapper for the entire single-page app. If auth was to ever to fail, for starters that client would not recieve any further communication via that channel, but they would be immediately redirected to the [[PAGE - Portal]] and cookies cleared.

```plaintext
// Initialize state variables for user ID and secret key using cookies
[id, setId] = useState(Cookies.get('id'))
[secretkey, setSecretKey] = useState(Cookies.get('secretkey'))

// Use effect hook to handle changes in user ID, secret key, and socket
useEffect:
    // Update secret key state variable with the latest value from cookies
    setSecretKey(Cookies.get('secretkey'))
    // Update user ID state variable with the latest value from cookies
    setId(Cookies.get('id'))

    // If both user ID and secret key are available:
    If id and secretkey are not null or undefined:
        // Send an initial connection request to the server
        Emit "initialConnection" event to socket with {id, secretkey} data

// Additional useEffect hook for handling changes in socket
useEffect:
    // If both user ID and secret key are available:
    If id and secretkey are not null or undefined:
        // Send an initial connection request to the server
        Emit "initialConnection" event to socket with {id, secretkey} data

// Handle "auth" event from the server
socket.on("auth", data => {
    // Log authentication data
    Log data to console

    // If authentication is unsuccessful:
    If data is falsy:
        // Remove user ID and secret key cookies
        Remove "id" cookie
        Remove "secretkey" cookie

        // Redirect the user to the portal page
        Redirect window to "/portal"
})
```


### Other Communication

The instance of the socket is then passed into the GraphQLHTTP server as a parameter, available to routes if the need. Routes which then need real-time bidirectional communication can then destructure the socket in the resolver and use the user's socket id to send them their data like this.

```plaintext
// Emit 'chatroom' event to the socket associated with the user
Emit 'chatroom' event to io.to(user.user.socket) with message data
```


#### Channels

###### Followed
Lets the followed user aware that they have just been followed. [[User Mutations#followUnfollowUser]] 

###### updatedChat
Sends a new message to the a user's message list. [[Chatroom Mutations#getLocation]]

###### chatroom
Emits a signal to the user's message interface between another user [[Chatroom Mutations#sendMessage]]