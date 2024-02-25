
Data pertaining to that of a post during the transit between layers. It makes use of natural data types and the [[Author Type]].

```graphql
GraphQLObjectType PostType:
    name: "Post"
    fields: 
        id:
            type: GraphQLInt
        content:
            type: GraphQLString
        user:
            type: AuthorType
        photo:
            type: GraphQLBoolean
        date:
            type: GraphQLString
        views:
            type: GraphQLList(AuthorType)
        likes:
            type: GraphQLList(AuthorType)
        avgRatio:
            type: GraphQLFloat
        multiplier:
            type: GraphQLFloat
```
