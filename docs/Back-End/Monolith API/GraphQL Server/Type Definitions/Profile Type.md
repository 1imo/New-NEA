
Now, with this type I feel like I have broken the rules a little in order to potentially reduce loading times for an end user who is requesting a profile of another user. The use-case could have used the [[User Type]], however, the transfer of people's entire friends, following and followers didn't appeal to me except for potential of a visiting user to peruse their following but that shouldn't happen every time.

```graphql
GraphQLObjectType ProfileType:
    name: "Profile"
    fields: 
        id:
            type: GraphQLString
        name:
            type: GraphQLString
        username:
            type: GraphQLString
        friendCount:
            type: GraphQLInt
        followerCount:
            type: GraphQLInt
        followingCount:
            type: GraphQLInt
```
