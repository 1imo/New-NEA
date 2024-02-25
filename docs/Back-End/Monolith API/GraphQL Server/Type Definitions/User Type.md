
The user is a central piece to the system. They are the ones making the decisions, taking action around the platform. Because each user thinks differently and responds differently it is safe to assume that we need to be rather broad in our module, but not too broad that we are no longer strongly typed. Please see [[Database/Models/User Model|User Model]] on db implementation.

```plaintext
GraphQLObjectType UserType:
    name: "User"
    fields: 
        id:
            type: GraphQLString
        username:
            type: GraphQLString
        name:
            type: GraphQLString
        posts:
            type: GraphQLList(PostType)
        friends:
            type: GraphQLList(UserType)
        followers:
            type: GraphQLList(UserType)
        following:
            type: GraphQLList(UserType)
        friendCount:
            type: GraphQLInt
        followerCount:
            type: GraphQLInt
        followingCount:
            type: GraphQLInt
        pending:
            type: GraphQLList(UserType)
        chatrooms:
            type: GraphQLList(GraphQLInt)
        avgRatio:
            type: GraphQLFloat
        socket:
            type: GraphQLString
```

As you can see, sensitive data like API keys are not available because they are stored in a separate table. The User Type is so broad because we do not have to return everything to the client if they do not request or need a part of it. But for GDPR regulations and privacy's sake, the [[SensitiveUserData Type]] facilitates the transfer of such data.