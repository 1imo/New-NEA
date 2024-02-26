
Mutations are similar to the standardized use of POST requests where it would be reasonable to assume that on any Mutation call, as any HTTP POST request, data would be modified somewhere. In this case it is the User.


### createUser 

My naming conventions are excellent in my opinion. This resolvers is called after a user has completed the [[Onboarding System]] workflow successfully and wishes to sign up to the platform. Right now not much data is asked of them in order to not delve into GDPR regulations, save on storage and not fuss around during the beta development of the [[Auth System]]. Anyway, it returns an API key which the user will then save to their cookies and use it for future auth requests.

Returns: [[SensitiveUserData Type]]


#### Analysis

To help users sign in and manage the process programatically, ie keeping their sessions persistent, we must generate API keys securely on the server side, store them and transmit it back across to them securely with HTTPS.


#### Design

```
Hash password
Generate unique API key
Create user:
    Set name as concatenation of firstName and lastName
    Set username from args
    Store hashed password and generated API key
Return user id and generated API key
```

![[Pasted image 20240226174810.png]]

```
Define createUser:
    Type: SensitiveUserDataType
    Arguments:
        firstName:
            Type: String
        lastName:
            Type: String
        username:
            Type: String
        password:
            Type: String
    Resolve asynchronously:
        Try:
            Sanitise args
            Hash password using bcrypt with salt rounds of 10
            Generate unique API key using nanoid library
            Create user in Prisma:
                Set name as concatenation of firstName and lastName
                Set username from args
                Create userData with hashed password and generated API key
            Return user id and generated API key
        Catch error:
            Log error
            Return
```

![[Pasted image 20240226175245.png]]


#### Tests

##### Test Case 1: Create a New User with First Name, Last Name, Username, and Password

**Procedure:**
1. Sanitize the arguments.
2. Hash the password using bcrypt with salt rounds of 10.
3. Generate a unique API key using the nanoid library.
4. Create a new user in Prisma with the provided first name, last name, username, hashed password, and generated API key.
5. Return the user ID and generated API key.

**Expected Result:**
1. Arguments are successfully sanitized.
2. Password is successfully hashed.
3. A unique API key is generated.
4. A new user is successfully created in Prisma with the provided information.
5. The user ID and generated API key are returned.


### signIn

The signIn resolver is called when a user would like to sign in with their platform-local credentials from the portal.

Returns: [[SensitiveUserData Type]]


#### Analysis

Users might have multiple devices, or whilst the server-side session management isn't up and running, they might have been logged out therefore users must be provided with a way to log into the platform.


#### Design

```
Define signIn:
    Type: SensitiveUserDataType
    Arguments:
        username:
            Type: String
        pass:
            Type: String
    Resolve asynchronously:
        Sanitise args
        Try:
            Fetch user data from Prisma:
                Where username matches args.username
                Select id, secretkey, and password
            If user data is not found:
                Throw error 'User not found'
            Compare hashed password with provided password using bcrypt:
                If passwords match:
                    Generate unique API key using nanoid library
                    Update user's secretkey in Prisma with the generated API key
                    Return user id and generated API key
                Else:
                    Throw error 'Password is incorrect'
        Catch error:
            Log error
            Return
```

![[Pasted image 20240223192728.png]]


#### Tests

##### Test Case 1: Sign In with Correct Username and Password

**Procedure:**
1. Sanitize the arguments.
2. Fetch user data from Prisma using the provided username.
3. If user data is found:
    - Compare the hashed password with the provided password using bcrypt.
    - If passwords match:
        - Generate a unique API key using the nanoid library.
        - Update the user's secret key in Prisma with the generated API key.
        - Return the user ID and generated API key.
    - If passwords do not match, throw an error 'Password is incorrect'.
4. If user data is not found, throw an error 'User not found'.

**Expected Result:**
- User is successfully authenticated.
- A unique API key is generated and updated in the user's record in Prisma.
- The user ID and generated API key are returned.


##### Test Case 2: Sign In with Incorrect Password

**Procedure:**
1. Sanitize the arguments.
2. Fetch user data from Prisma using the provided username.
3. If user data is found:
    - Compare the hashed password with the provided password using bcrypt.
    - If passwords match:
        - Generate a unique API key using the nanoid library.
        - Update the user's secret key in Prisma with the generated API key.
        - Return the user ID and generated API key.
    - If passwords do not match, throw an error 'Password is incorrect'.
4. If user data is not found, throw an error 'User not found'.

**Expected Result:**
- Error 'Password is incorrect' is thrown.
- User authentication fails.


##### Test Case 3: Sign In with Nonexistent Username

**Procedure:**
1. Sanitize the arguments.
2. Fetch user data from Prisma using the provided username.
3. If user data is found:
    - Compare the hashed password with the provided password using bcrypt.
    - If passwords match:
        - Generate a unique API key using the nanoid library.
        - Update the user's secret key in Prisma with the generated API key.
        - Return the user ID and generated API key.
    - If passwords do not match, throw an error 'Password is incorrect'.
4. If user data is not found, throw an error 'User not found'.

**Expected Result:**
- Error 'User not found' is thrown.
- User authentication fails.


### followUnfollowUser

Follows or unfollows/ unfriends a user depending on the current state of the relationship between the two users. I still need to implement the use case where they are already friends - at the time I didn't think it to be important in the name of time and reducing overhead. People should stay friends!

If a new relationship is created, the other user is made aware through the use of [[INDEX - Web Socket Server#Channels#Followed]]

Returns: [[Link Type]]


#### Analysis

As a social media platform, users will want to create, maintain and prune connections they have among each other. This requires an endpoint that can satisfy follow and friendship states as well as returning feedback to the user.


#### Design

```
Check if a follow relationship already exists between the two users:
    If exists:
        Delete the follow relationship
    Else:
        Create a new follow relationship
Emit 'followed' event to recipient's socket using socket.io
```

![[Pasted image 20240223201448.png]]

```
Define followUnfollowUser:
    Type: LinkType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        username:
            Type: GraphQLString
    Resolve asynchronously:
        Sanitise args
        Try:
            Authenticate user using provided id and secretkey
            Fetch recipient user from Prisma:
                Where username matches args.username
                Select id and socket
            If recipient doesn't exist: throw Error
            Check if a follow relationship already exists between the two users:
                If exists:
                    Fetch the follow relationship from Prisma
                    Delete the follow relationship
                Else:
                    Create a new follow relationship in Prisma:
                        Set followerId to args.id and followingId to recipient.id
                        Return id of the newly created follow relationship and select follower's id, name, and username
                    Emit 'followed' event to recipient's socket using socket.io
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Follow a User

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Fetch the recipient user from Prisma using the provided username.
4. Check if a follow relationship already exists between the two users:
    - If it exists:
        - Fetch the follow relationship from Prisma.
        - Delete the follow relationship.
    - If it does not exist:
        - Create a new follow relationship in Prisma with the follower ID and recipient ID.
        - Emit a 'followed' event to the recipient's socket using socket.io.

**Expected Result:**
- A new follow relationship is created between the users if it did not exist.
- If a follow relationship already existed, it is deleted.
- The appropriate 'followed' event is emitted to the recipient's socket.


##### Test Case 2: Unfollow a User

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Fetch the recipient user from Prisma using the provided username.
4. Check if a follow relationship already exists between the two users:
    - If it exists:
        - Fetch the follow relationship from Prisma.
        - Delete the follow relationship.
    - If it does not exist:
        - Create a new follow relationship in Prisma with the follower ID and recipient ID.
        - Emit a 'followed' event to the recipient's socket using socket.io.

**Expected Result:**
- The existing follow relationship between the users is deleted.
- No 'followed' event is emitted to the recipient's socket.


##### Test Case 3: Invalid Username

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Fetch the recipient user from Prisma using the provided username.
4. Check if a follow relationship already exists between the two users:
    - If it exists:
        - Fetch the follow relationship from Prisma.
        - Delete the follow relationship.
    - If it does not exist:
        - Create a new follow relationship in Prisma with the follower ID and recipient ID.
        - Emit a 'followed' event to the recipient's socket using socket.io.

**Expected Result:**
- Error is logged indicating that the recipient user does not exist.
- No follow relationship is created.
- No 'followed' event is emitted.

### pendingRequest

When a user decided to interact with their pending requests/ new follows, they have 3 options to pick. If this route has had to be utilized 2, but they could just do nothing. Anyway they can decline or accept the friendship silently without letting the other party know.

Returns: [[User Type]]


#### Analysis

A separate route for easing the complexity between the follow/ unfollow route and friendships was necessary. It must forge new friendships or remove the follow from the list so as to not see it.


#### Design

```
Switch on action:
    Case 'add':
        Create a new friendship
    Case 'remove':
        Deny relationship
```

![[Pasted image 20240226181645.png]]

```
Define pendingRequest:
    Type: UserType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        request:
            Type: String
        action:
            Type: String
    Resolve asynchronously:
        Sanitise args
        Try:
            Authenticate user using provided id and secretkey
            Fetch follow relationship from Prisma using request id:
                Select follower's id, username, and name
                Select following's id, username, and name
                Select request id
            Switch on action:
                Case 'add':
                    Create a new friendship in Prisma:
                        Set userOneId to follower's id and userTwoId to following's id
                    Delete the follow relationship from Prisma using request id
                Case 'remove':
                    Update the follow relationship in Prisma using request id:
                        Set denial to true
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Accept Friendship Request

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Fetch the follow relationship from Prisma using the request ID.
4. Create a new friendship in Prisma with userOneId set to the follower's ID and userTwoId set to the following's ID.
5. Delete the follow relationship from Prisma using the request ID.

**Expected Result:**
- A new friendship is created between the users.
- The follow relationship is deleted.


##### Test Case 2: Deny Friendship Request

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Fetch the follow relationship from Prisma using the request ID.
4. Update the follow relationship in Prisma using the request ID, setting denial to true.

**Expected Result:**
- The denial flag is set to true for the follow relationship.


##### Test Case 3: Invalid Action

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Fetch the follow relationship from Prisma using the request ID.

**Expected Result:**
- No changes are made to the database.

### editDetails

Called from the settings page if a user would like to change their name, username or password. Username locking is still not created. Type of change is passed through and if password is changed a new API key is passed through maintaining the user's current session.

Returns: [[SensitiveUserData Type]]


#### Analysis

Users might periodically want to update their information such as their password to make sure their account is secure. They might change their name afk or they might want to freshen up their username. Therefore functionality needs to be created to accommodate such needs.


#### Design

```
Switch on request:
	Case 'name':
        Update user's name
    Case 'username':
        Update user's username
    Case 'password':
        Hash the provided data
        Generate a new secret key using nanoid
        Update user's password and secret key
        Return a new secret key
```

![[Pasted image 20240226182620.png]]

```
Define editDetails:
    Type: SensitiveUserDataType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        request:
            Type: String
        data:
            Type: String
    Resolve asynchronously:
        Sanitise args
        Try:
            Authenticate user using provided id and secretkey
            Switch on request:
                Case 'name':
                    Update user's name in Prisma:
                        Set name to data
                    Return
                Case 'username':
                    Update user's username in Prisma:
                        Set username to data
                    Return
                Case 'password':
                    Hash the provided data
                    Generate a new secret key using nanoid
                    Update user's password and secret key in Prisma:
                        Set password to hashed data
                        Set secretkey to generated key
                    Return a new secret key
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Edit Name

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Call the `editDetails` resolver with `request` set to 'name' and `data` containing the new name.

**Expected Result:**
- The user's name is updated in the database to the provided new name.


##### Test Case 2: Edit Username

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Call the `editDetails` resolver with `request` set to 'username' and `data` containing the new username.

**Expected Result:**
- The user's username is updated in the database to the provided new username.


##### Test Case 3: Change Password

**Procedure:**
1. Sanitize the arguments.
2. Authenticate the user using the provided ID and secret key.
3. Call the `editDetails` resolver with `request` set to 'password' and `data` containing the new password.

**Expected Result:**
- The user's password is updated in the database to the provided new password.
- A new secret key is generated and returned.