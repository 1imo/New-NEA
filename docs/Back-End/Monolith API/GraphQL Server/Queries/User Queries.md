
User Queries are a module of the Query Resolvers that are associated with querying data mainly related to a discovering new things related to themselves and other Users on the platform.

###### Note
The start of all routes begins with the security process which is the abstraction of Security Protocols in the DFDs below [[INDEX - Security]]


### navInfo

This Resolver returns a user's name and username based on the id alone. It is designed to be used alongside the [[Nav Component]].

Returns: [[User Type]]


#### Analysis

Initially I wanted to run the auth system through the request of data with this component but it didn't end up on every screen so instead I opted for an endpoint to provide information to the nav and to reduce strain it is cached client-side every session.


#### Design

![[Pasted image 20240223141810.png]]

```
Define navInfo:
    Type: UserType
    Arguments:
        id:
            Type: String
    Resolve asynchronously:
        Try:
            Sanitise args
            Fetch user from Prisma:
                Where id equals args.id
                Select name and username
            Return user
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Retrieve User Navigation Info

**Procedure:**
1. Provide a valid user ID as an argument.
2. Call the `navInfo` resolver with the provided user ID.

**Expected Result:**
- The resolver should return the navigation information for the user corresponding to the provided ID.
- The returned user data should include the user's name and username.


##### Test Case 2: User Not Found

**Procedure:**
1. Provide a non-existent user ID as an argument.
2. Call the `navInfo` resolver with the provided user ID.

**Expected Result:**
- The resolver should return null or an empty response since the user with the provided ID does not exist.


##### Test Case 3: Invalid User ID Format

**Procedure:**
1. Provide an invalid format for the user ID (e.g., an integer instead of a string).
2. Call the `navInfo` resolver with the invalid user ID.

**Expected Result:**
- The resolver should throw an error or return null since the provided user ID format is invalid.


### getPublicInfo

Used to query a user's profile data when their profile page is accessed from the client.

Returns: [[Profile Type]]


#### Analysis

An open endpoint to facilitate in open data sharing which helps in the freedom of information available on the platform and for fetching user profile info. Should be query-able by username.


#### Design

```
Fetch user
Calculate friend count: friends.length + friendshipsReceived.length
Return user info with calculated counts
```

![[Pasted image 20240223141933.png]]

```
Define getPublicInfo:
    Type: ProfileType
    Arguments:
        username:
            Type: String
    Resolve asynchronously:
        Try:
            Sanitise args
            Fetch user from Prisma:
                Where username equals args.username
                Select id, name, username, friends, friendshipsReceived, followers, following
            Calculate friend count: friends.length + friendshipsReceived.length
            Return user info with calculated counts
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Retrieve User Profile Info

**Procedure:**
1. Provide a valid user ID as an argument.
2. Call the `navInfo` resolver with the provided user ID.

**Expected Result:**
- The resolver should return the navigation information for the user corresponding to the provided ID.
- The returned user data should include the user's name, username and values for their social networks.


##### Test Case 2: User Not Found

**Procedure:**
1. Provide a non-existent user ID as an argument.
2. Call the `navInfo` resolver with the provided user ID.

**Expected Result:**
- The resolver should return null or an empty response since the user with the provided ID does not exist.


##### Test Case 3: Invalid User ID Format

**Procedure:**
1. Provide an invalid format for the user ID (e.g., an integer instead of a string).
2. Call the `navInfo` resolver with the invalid user ID.

**Expected Result:**
- The resolver should throw an error or return null since the provided user ID format is invalid.


### getAllPosts

Also for use on a user's profile page. It aims to return all posts by a specific user to then be displayed under their profile.

Returns: List of [[Post Type]]


#### Analysis

For the profile UI, a user's feed needs to be queried in full. I made this a separate resolver as this can be rather large. In future lazy loading and requesting may be implemented with pagination so that huge amounts of data are not in transit or being processed at any one time.


#### Design

![[Pasted image 20240223142008.png]]

```
Define getAllPosts:
    Type: List of PostType
    Arguments:
        username:
            Type: String
    Resolve asynchronously:
        Try:
            Sanitise arguments
            Fetch user from Prisma:
                Where username equals provided username
                Select posts with content, id, photo, and user information
            Return user's posts
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Retrieve All Posts for a User

**Procedure:**
1. Provide a valid username as an argument.
2. Call the `getAllPosts` resolver with the provided username.

**Expected Result:**
- The resolver should return a list of posts made by the user corresponding to the provided username.
- Each post in the list should include the post's ID, content, whether it has a photo attached, and user information (ID, username, and name).


##### Test Case 2: User Not Found

**Procedure:**
1. Provide a non-existent username as an argument.
2. Call the `getAllPosts` resolver with the provided username.

**Expected Result:**
- The resolver should return null or an empty response since the user with the provided username does not exist.


##### Test Case 3: Invalid Username Format

**Procedure:**
1. Provide an invalid format for the username (e.g., special characters or spaces).
2. Call the `getAllPosts` resolver with the invalid username.

**Expected Result:**
- The resolver should throw an error or return null since the provided username format is invalid.


### getUserSearchResults

A query for discovering users for messaging and profile discovery purposes. SQL filtering is used to return results where either the name, or username of a given user return a string. At the start, a list of all users is returned because an empty string satisfies all conditions - for scalability purposes I will not be implementing the recommendation algorithm here yet.

Returns: List of [[User Type]]


#### Analysis

To enable content and user discover on the platform there must be a search function that returns data that has been queried with the user's inputted parameters.


#### Design

![[Pasted image 20240223142809.png]]

```
Define getUserSearchResults:
    Type: New List of UserType
    Arguments:
        username:
            Type: GraphQLString
        type:
            Type: GraphQLString
    Resolve asynchronously:
        Try:
            Sanitise args
            Fetch names from Prisma:
                Where username contains args.username OR name contains args.username
                Select id, name, and username
            Return names
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Search Users by Username

**Procedure:**
1. Provide a valid username as an argument.
2. Call the `getUserSearchResults` resolver with the provided username.

**Expected Result:**
- The resolver should return a list of user objects matching the provided username.
- Each user object should include the user's ID, name, and username.


##### Test Case 2: Search Users by Name

**Procedure:**
1. Provide a valid name (full name or partial name) as an argument.
2. Call the `getUserSearchResults` resolver with the provided name.

**Expected Result:**
- The resolver should return a list of user objects whose names match the provided name (full or partial).
- Each user object should include the user's ID, name, and username.


##### Test Case 3: No Matching Results

**Procedure:**
1. Provide a username or name that does not match any users in the database.
2. Call the `getUserSearchResults` resolver with the provided username or name.

**Expected Result:**
- The resolver should return an empty list since there are no users matching the provided username or name.


### getChatroomData

Returns all the data relating to a chatroom of requested chat ID.

Returns: [[Chatroom Type]]


#### Analysis

An endpoint is required to get the necessary information about a chatroom when a user enters the UI for the chatroom. 


#### Design

![[Pasted image 20240223143156.png]]

```
Query getChatroomData:
    Type: ChatroomType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        chatId:
            Type: GraphQLString
    Resolve asynchronously:
        Try:
            Sanitise args
            Check authentication
            Define chatroom as empty object
            Fetch chatroom from Prisma:
                Where id equals args.chatId
                Select id and messages:
                    Select id, content, sender id, and read status for each message
                Select chatroomUsers:
                    Select id, name, and username for each user
            Map chatroomUsers to extract user details
            Return chatroom details with extracted chatroomUsers
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Retrieve Chatroom Data with Valid Credentials

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Provide a valid `chatId`.
3. Call the `getChatroomData` resolver with the provided arguments.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should fetch the chatroom data corresponding to the provided `chatId`.
- The resolver should return the chatroom details, including the chatroom ID, chatroom users' details (IDs, names, usernames), messages (IDs, content, sender IDs, read status), and an empty last message.


##### Test Case 2: Retrieve Chatroom Data with Invalid Credentials

**Procedure:**
1. Provide an invalid `id` or `secretkey`.
2. Provide a valid `chatId`.
3. Call the `getChatroomData` resolver with the provided arguments.

**Expected Result:**
- The resolver should fail to authenticate the user due to invalid credentials.
- The resolver should not fetch any chatroom data.
- The resolver should return null or undefined, indicating an error or lack of authorization.


##### Test Case 3: Retrieve Chatroom Data with Invalid Chat ID

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Provide an invalid or non-existent `chatId`.
3. Call the `getChatroomData` resolver with the provided arguments.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should not find any chatroom data corresponding to the provided `chatId`.
- The resolver should return null or an empty object for the chatroom details.


### getPending

Returns a list of pending requests that a user has received and not yet declined or accepted. In essence a new follow.

Returns: List of [[Pending Type]]


#### Analysis

There needs to be an initial request for friendships on page load


#### Design

![[Pasted image 20240223144426.png]]

```
GetPending:
    Type: List of PendingType
    Arguments:
        id: String
        secretkey: String
    Resolve asynchronously:
        Try:
            Sanitise args
            Authenticate using args.id and args.secretkey
            Fetch follows from Prisma:
                Where followingId equals args.id and denial is false
                Select id and follower's id, name, and username
            Return follows mapped to pending objects:
                Map each follow data to a pending object with pendingId and follower's details
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Retrieve Pending Follow Requests with Valid Credentials

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Call the `getPending` resolver with the provided arguments.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should fetch pending follow requests where the user is the recipient (`followingId`) and denial is false.
- The resolver should return a list of pending follow requests, each containing the pending ID and details of the follower (ID, name, username).


##### Test Case 2: Retrieve Pending Follow Requests with Invalid Credentials

**Procedure:**
1. Provide an invalid `id` or `secretkey`.
2. Call the `getPending` resolver with the provided arguments.

**Expected Result:**
- The resolver should fail to authenticate the user due to invalid credentials.
- The resolver should not fetch any pending follow requests.
- The resolver should return null or undefined, indicating an error or lack of authorization.


##### Test Case 3: Retrieve Pending Follow Requests with No Pending Requests

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Ensure that there are no pending follow requests for the user.
3. Call the `getPending` resolver with the provided arguments.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should not find any pending follow requests.
- The resolver should return an empty list, indicating that there are no pending follow requests for the user.


### getFeed

Returns the feed for a user at that moment in time. It can be filtered based on 4 predefined options by the user on the [[PAGE - Settings]]: Recommended, Friends, Following and Date.

All options initially get all the posts of the friends and following. I have yet to implement the retrieval of data with pagination in multiples and fetching posts by order of desc utilizing the Date attribute. I could also do preflight checks if a user would like a specific group beforehand, potentially saving a database call.

I must remind you that the aim of this platform is not to create a vortex, sucking people's time but to foster new connections where 

Returns: List of [[Post Type]]

![[Pasted image 20240223145458.png]]

```plaintext
Define getFeed:
    Type: new GraphQLList(PostType)
    Arguments:
        id:
            Type: GraphQLString
        secretkey:
            Type: GraphQLString
        type:
            Type: GraphQLString
    Resolve asynchronously:
        Try:
            Sanitise args
            Check authentication
            Fetch posts from Prisma:
                Where id equals args.id
                Select posts from users the user follows:
                    Select posts, user's name, id, and username
                Select posts from user's friends:
                    Select posts, user's name, id, and username
                Select posts from users who sent friendship requests that succeeded:
                    Select posts, user's name, id, and username
            Return fetched posts
        Catch error:
            Log error
            CONTINUE PROCESSING
```



###### Following
This section of the resolver retrieves posts from users that the authenticated user is following. It iterates through each user the authenticated user follows and extracts their posts.

![[Pasted image 20240223155411.png]]

```plaintext
	Try:
	    Reverse the order of the retrieved posts array
        Return the posts array
    Catch any errors:
        Log the error
        Return null or an empty array
```

###### Friends
In this part, posts from the authenticated user's friends and users who sent friendship requests are retrieved. Similar to the previous section, it iterates through each friend and extracts their posts, including those from pending friendships.

![[Pasted image 20240223155356.png]]

```plaintext
	Try:
	    Reverse the order of the retrieved posts array
        Return the posts array
    Catch any errors:
        Log the error
        Return null or an empty array
```

###### Date
When the type parameter is set to 'Date', the resolver returns the raw merged array of following and friends' posts sorted by date. It does not apply any additional sorting or manipulation.

![[Pasted image 20240223154849.png]]

```plaintext
Set followingAvgRatio to 0
Set friendsAvgRatio to 0

If followingPosts is not empty:
  For each post in followingPosts:
    Add the post's avgRatio to followingAvgRatio

If friendsPosts is not empty:
  For each post in friendsPosts:
    Add the post's avgRatio to friendsAvgRatio

Calculate multiplier as:
  If followingAvgRatio divided by friendsAvgRatio is not zero:
    Set it to followingAvgRatio divided by friendsAvgRatio
  Else:
    Set it to 1

Define mergeSort function that takes an array and a type parameter:
  If the length of the array is less than or equal to 1:
    Return the array
  Find the middle index of the array
  Slice the array into left and right halves
  Recursively call mergeSort on the left and right halves
  Return the result of merging the sorted left and right halves using the merge function

Define merge function that takes left, right, and type parameters:
  Create an empty array called result
  Initialize leftIndex and rightIndex to 0
  While leftIndex is less than the length of the left array and rightIndex is less than the length of the right array:
    If the date of the post at leftIndex is greater than or equal to the date of the post at rightIndex:
      If type is true:
        Update the avgRatio of the post at leftIndex
      Else:
        Update the avgRatio of the post at leftIndex
      Push the post at leftIndex to the result array
      Increment leftIndex by 1
    Else:
      If type is true:
        Update the avgRatio of the post at rightIndex
      Else:
        Update the avgRatio of the post at rightIndex
      Push the post at rightIndex to the result array
      Increment rightIndex by 1
  Concatenate any remaining elements from left and right arrays to the result array
  Return the result array

Sort followingPosts with mergeSort using type 0
Sort friendsPosts with mergeSort using type 1
Concatenate followingPosts and friendsPosts into raw array

If args.type is 'Date':
  Return raw
```

###### Recommended
For 'Average Ratio', the resolver first calculates a multiplier based on the ratio of average ratios between the following and friends' posts so as to not differentiate between them and to merge them together at the right intervals. It then adjusts each post's average ratio accordingly. After merging the arrays with Merge Sort, it sorts them by date and returns the sorted array. This sorting prioritizes posts with higher average ratios, adjusted by the multiplier which if received correctly will be the way to promote posts on the platform, driving potential profitability.

![[Pasted image 20240223155241.png]]

```plaintext
Set swaps to 0

Define swapRatio function that takes an array arr as parameter:
  For each element i in the array arr:
    If i is not the last index of the array arr:
      If the avgRatio of the post at index i is less than the avgRatio of the post at index i+1:
        Swap the posts at indexes i and i+1
        Increment swaps by 1

  If swaps is not equal to 0:
    Set swaps to 0
    Recursively call swapRatio function with array arr

Call swapRatio function with raw array

Return raw array
```

![[Pasted image 20240223221041.png]]


#### Tests

##### Test Case 1: Retrieve Following Posts Sorted by Date

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Set the `type` argument to `'Following'`.
3. Call the `getFeed` resolver with the provided arguments.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should fetch posts from users followed by the specified user.
- The resolver should sort the retrieved posts by date in descending order.
- The resolver should return a list of posts from followed users sorted by date.


##### Test Case 2: Retrieve Friends' and Received Friendships' Posts Sorted by Date

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Set the `type` argument to `'Friends'`.
3. Call the `getFeed` resolver with the provided arguments.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should fetch posts from friends and users with whom friendships were received.
- The resolver should sort the retrieved posts by date in descending order.
- The resolver should return a list of posts from friends and users with received friendships sorted by date.


##### Test Case 3: Retrieve All Posts Sorted by Date

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Set the `type` argument to `'Date'`.
3. Call the `getFeed` resolver with the provided arguments.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should fetch all posts from followed users, friends, and users with received friendships.
- The resolver should sort the retrieved posts by date in descending order.
- The resolver should return a list of all posts sorted by date.


##### Test Case 4: Retrieve Following Posts with Custom Sorting

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Call the `getFeed` resolver with the provided arguments without specifying the `type`.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should fetch posts from users followed by the specified user.
- The resolver should sort the retrieved posts by a custom algorithm considering the average ratio and multiplier.
- The resolver should return a list of posts from followed users sorted by the custom algorithm.


### recommendedUsers

recommendedUsers is the interface which you can query for discovering new profiles in the same network as you. Whilst this sounds like the definition of an echo chamber, it is always great to get to know more people around you. It works by sending the user's ID along with the friends and following's ID of each of the user's friends and following to a separate micro service I wrote in Rust. Looking at it now it would have been better to write it as a WASM module or connect the Db to Rust and use threads in parallel for an even greater performance boost, however, we can do that in the future if we need.

On the Rust server, we receive the data in a JSON format and we proceed to destructure it making use of the user struct. Then connections are established through the use of a hashmap and then we analyse the 3rd layer of connections for the greatest amount of social connections, ordering the vec! that way. Then we return it back to the main API where if at least 10 connections haven't been returned, the remainder will be made up of the top performing creators on the platform.

Returns: List of [[Author Type]]

![[Pasted image 20240223180723.png]]

```
activityDiagram
  A[Start] --> B{Sanitize arguments}
  B --> C{Authenticate user}
  alt Authentication successful
    C --> D{Fetch user data}
    D --> E{Extract friend & following IDs}
    E --> F{Check for recommendations from friends/following}
    loop Not all users have recommendations
      F --> G(sub):{Fetch user data (friend/following)}
      G --> H{Check for recommendations}
      H --> F
    end
    F --> I{Get recommendations from external API}
    I --> J{Filter & format recommendations}
    J --> K{Return recommendations}
  else Authentication failure
    C --> L{Log error}
    L --> M[End]
  end
  K --> M[End]
```

![[Pasted image 20240223180608.png]]


#### Tests

##### Test Case 1: Retrieve Recommended Users

**Procedure:**
1. Provide a valid `id` and `secretkey`.
2. Call the `recommendedUsers` resolver with the provided arguments.

**Expected Result:**
- The resolver should authenticate the user successfully.
- The resolver should fetch the user's friends, received friendships, and following users.
- The resolver should fetch additional users based on the user's network to provide recommendations.
- The resolver should send a request to an external API for additional recommendations.
- The resolver should format the recommendations and return them.
- If the number of recommendations is less than 10, the resolver should fetch top high-performing users from the database sorted by average ratio and add them to the recommendations.
- The resolver should log any errors encountered during the process.
- The resolver should return a list of recommended users with their public information (id, username, name).