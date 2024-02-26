
Requests to the API for the change of stored data relating to the [[Post Model]].


### createPost

Request to create a post on the network by a user. After creation, user is redirected to the dedicated page of the post in question.

Returns: [[Link Type]]


#### Analysis

Creating a post interface that prevents unauthenticated users from posting to the network and in future a potential gateway to preventing spam. No serious authentication methods to allow for bot connection to with the use of the user's API key and ID.


#### Design

```
Define createPost:
    Type: LinkType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        content:
            Type: String
        photo:
            Type: Boolean
    Resolve asynchronously:
        Sanitise args
        Try:
            Authenticate user using provided id and secretkey
            Create a new post in Prisma:
                Set content to args.content
                Set userId to args.id
                Set photo to args.photo
            Return the URL of the created post and its ID
        Catch error:
            Log error
            Return
```

![[Pasted image 20240226173826.png]]


#### Tests

##### Test Case 1: Create a New Post with Content and Photo

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided id and secret key.
3. Create a new post in Prisma with the provided content, user ID, and photo flag.
4. Return the URL of the created post and its ID.

**Expected Result:**
1. Arguments are successfully sanitized.
2. User authentication is successful.
3. A new post is successfully created in Prisma with the provided content, user ID, and photo flag.
4. The URL of the created post and its ID are returned.


##### Test Case 2: Create a New Post with Content Only

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided id and secret key.
3. Create a new post in Prisma with the provided content and user ID.
4. Return the URL of the created post and its ID.

**Expected Result:**
1. Arguments are successfully sanitized.
2. User authentication is successful.
3. A new post is successfully created in Prisma with the provided content and user ID.
4. The URL of the created post and its ID are returned.


##### Test Case 3: Create a New Post with Photo Only

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided id and secret key.
3. Create a new post in Prisma with the provided photo flag and user ID.
4. Return the URL of the created post and its ID.

**Expected Result:**
1. Arguments are successfully sanitized.
2. User authentication is successful.
3. A new post is successfully created in Prisma with the provided photo flag and user ID.
4. The URL of the created post and its ID are returned.


### postViewed 

Hit when a post is in the viewport of a user. It will affect the [[Database/Models/User Model|User Model#avgRatio]] by recalculating the like to view count ratio of said post affecting it's future rankings in peoples' feeds.

Returns: [[Link Type]]


### postLiked

Triggered when a user double taps the post component. It also affects the [[Database/Models/User Model|User Model#avgRatio]] by recalculating the view count ratio.

Returns: [[Link Type]]
