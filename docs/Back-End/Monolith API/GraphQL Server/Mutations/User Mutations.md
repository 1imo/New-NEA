
Mutations are similar to the standardized use of POST requests where it would be reasonable to assume that on any Mutation call, as any HTTP POST request, data would be modified somewhere. In this case it is the User.


### createUser 

My naming conventions are excellent in my opinion. This resolvers is called after a user has completed the [[Onboarding System]] workflow successfully and wishes to sign up to the platform. Right now not much data is asked of them in order to not delve into GDPR regulations, save on storage and not fuss around during the beta development of the [[Auth System]]. Anyway, it returns an API key which the user will then save to their cookies and use it for future auth requests.

Returns: [[SensitiveUserData Type]]

```plaintext
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

![[Pasted image 20240223221846.png]]


### signIn

The signIn resolver is called when a user would like to sign in with their platform-local credentials from the portal.

Returns: [[SensitiveUserData Type]]

![[Pasted image 20240223192728.png]]

```plaintext
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


### followUnfollowUser

Follows or unfollows/ unfriends a user depending on the current state of the relationship between the two users. I still need to implement the use case where they are already friends - at the time I didn't think it to be important in the name of time and reducing overhead. People should stay friends!

If a new relationship is created, the other user is made aware through the use of [[INDEX - Web Socket Server#Channels#Followed]]

Returns: [[Link Type]]

![[Pasted image 20240223201448.png]]

```plaintext
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


### pendingRequest

When a user decided to interact with their pending requests/ new follows, they have 3 options to pick. If this route has had to be utilized 2, but they could just don nothing. Anyway they can decline or accept the friendship silently without letting the other party know.

Returns: [[User Type]]

```
@startuml
start
:Sanitise args;
if (Authenticate user) then (yes)
    :Fetch recipient user;
    if (Follow relationship exists) then (yes)
        :Delete follow relationship;
    else (no)
        :Create follow relationship;
    endif
else (no)
    :Log error;
endif
:Return;
stop
@enduml
```

```plaintext
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


### editDetails

Called from the settings page if a user would like to change their name, username or password. Username locking is still not created. Type of change is passed through and if password is changed a new API key is passed through maintaining the user's current session.

Returns: [[SensitiveUserData Type]]

```plantuml
@startuml
actor User
boundary System {
    editDetails
}
User --> editDetails
@enduml
```

```plaintext
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