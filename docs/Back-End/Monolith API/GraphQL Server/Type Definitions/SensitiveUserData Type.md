
This type is to facilitate the transfer of an API key to the client on sign in, sign up or password change.

```plaintext
GraphQLObjectType SensitiveUserDataType:
    name: "SensitiveUserData"
    fields: 
        id:
            type: GraphQLString
        secretkey:
            type: GraphQLString
```



