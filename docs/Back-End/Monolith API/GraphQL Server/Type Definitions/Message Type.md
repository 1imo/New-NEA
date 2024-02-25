
Medium of carrying message data across the layer. Makes use of [[Author Type]]

```graphql
GraphQLObjectType MessageType:
    name: "Message"
    fields: 
        id:
            type: GraphQLString
        sender:
            type: AuthorType
        content:
            type: GraphQLString
        date:
            type: GraphQLString
        read:
            type: GraphQLBoolean
```

