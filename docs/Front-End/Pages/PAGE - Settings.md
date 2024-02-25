
__Path__: /settings
__Intention__: Place for a user to change their settings and accept friend requests


### External Components Rendered

- [[ProfileInsight Component]]
- [[Input Component]]
- [[Loading Component]]


### On First Render

On the first render a socket listener is opened to show follows in real-time if the User is followed whilst on the page. The [[#Feed Change Option]] is also fetched from the user's cookies to display the last chosen type, or `Recommended` by default.

```
Use effect:
    - Function:
        - followedHandler(da):
            - Parameters:
                - da: Data received from the "followed" event
            - Conditions:
                - Check if the render array is empty or the ID of the first element is different from the follower's ID:
                    - Format the follower data with pendingId
                    - Add the formatted data to the beginning of the render array
                    - Log the formatted data
    - Side Effects:
        - Attach an event listener for "followed" event on the socket:
            - When the event is received, call the followedHandler function
        - Initialize the optn variable with the value stored in the "feed" cookie or if null use "Recommended"
    - Cleanup:
        - Detach the event listener for "followed" event from the socket when the component unmounts
```

![[Pasted image 20240225050529.png]]


### Functionality 

The are only a few things that can be changed for now such as the user's name, username and password. They can also [[#log out]] here. All of these changes are done through the [[INDEX - Monolith API]] except for the feed type.

![[Pasted image 20240225052937.png]]

![[Pasted image 20240225050844.png]]


##### Changing the Feed

After adjusting the rendered feed type [[#On First Render]], the feed can be further adjusted by simply tapping the option. It will change, and store in real-time.

```
Function: changeFeed()
    - Description: Changes the feed option and updates the state and the corresponding cookie value.
    - Conditions:
        - Check if the current option is not the last one in the feedOptns array:
            - If true:
                - Increment the current option by 1
                - Set the cookie "feed" to the next option in the feedOptns array
            - If false:
                - Set the current option to the first one
                - Set the cookie "feed" to the first option in the feedOptns array
```


##### Changing a User's Data

First the edit() is called on the interaction with a wish to change specific data. Parameters of the placeholder and type of data are passed in so as to understand the type of data which the user will input, as well as keep our code reusable.

![[Pasted image 20240225060024.png]]

```
<section>
	<h4 style={{marginBottom: 16}}>Settings</h4>
	<p style={{marginBottom: 8}} onClick={() => changeFeed()}>Tap to change feed: {feedOptns[optn]}</p>
	<p style={{marginBottom: 8}} onClick={() => edit("New Name..", "name")}>Change Name</p>
	<p style={{marginBottom: 8}} onClick={() => edit("New Username..", "username")}>Change Username</p>
	<p style={{marginBottom: 8}} onClick={() => edit("New Password..", "password")}>Change Password</p>
	<p style={{marginBottom: 8}} onClick={() => logout()}>Log Out</p>
</section>
```

Then setting the view to one with setView(1) will change the UI to the [[Input Component]] which will return a value back after completion.

```
function edit(placeholder, type) {
	setPlaceholder(placeholder)
	setPicked(type)
	setView(1)
}
```

After data is returned, the data is sent to [[User Mutations#editDetails]] and if the request was to change a password, a new secretkey (API key) will be returned and set in Cookies.

```
Function: call()
    - Description: Performs an asynchronous operation to edit user details and updates the secret key cookie if necessary.
    - Steps:
        1. Await the result of the createEdit mutation with the provided variables:
            - id: The user's ID obtained from the Context.
            - secretkey: The user's secret key obtained from the Context.
            - request: The type of request (e.g., "name", "username", "password").
            - data: The new value for the requested change.
        2. If the response contains a new secret key:
            - Update the "secretkey" cookie with the new value, expiring in 7 days.
        3. Return the response.
```

Finally the view is changed back to normal


### Fetching Friend Requests

Whilst loading, display [[Loading Component]], if error fetching request show alert() to user.

```plaintext
Call the GET_PENDING_REQUESTS function:
    Parameters:
        id = Ctx.id
        secretkey = Ctx.secretkey
```

Then the data is mapped through and displayed in [[ProfileInsight Component]]s.

For more information on how Friend Requests are accepted and declined, see [[Follows, Following & Friendships]]


### UI

##### Mobile
![[Pasted image 20240225175736.png]]

##### Desktop
![[Pasted image 20240225061246.png]]
