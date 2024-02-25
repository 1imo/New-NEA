
The Author Type. It's a brief concise way of grouping the user's main data in an entity that they have created such as a message or post to show ownership.

Is found in [[Post Type]] and [[Message Type]]

```graphql
GraphQLObjectType AuthorType:
    name: "Author"
    fields:
        id:
            type: GraphQLString
        name:
            type: GraphQLString
        username:
            type: GraphQLString
```
