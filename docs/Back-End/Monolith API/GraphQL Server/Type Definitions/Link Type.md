
Used in order to redirect people on the client since GraphQL doesn't have a native redirect method. It also doesn't have a null or void return type and it would feel wrong to not have a type because then you could return anything so I use this to because unless there is direct functionality on the client to redirect them, nothing will occur and no data is passed in to begin with.

```graphql
GraphQLObjectType LinkType:
    name: "Link"
    fields:
        url:
            type: GraphQLString
        id:
            type: GraphQLString
```
