
This refers to in essence the data of a follower but it is used in order to show pending friend requests.

```graphql
GraphQLObjectType PendingType:
    name: "Pending"
    fields: 
        id:
            type: GraphQLString
        name:
            type: GraphQLString
        username:
            type: GraphQLString
        pendingId:
            type: GraphQLString
```
