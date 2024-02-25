
Type represents a chatroom between users. It is designed to accommodate scalability in the future for group chats between users without the need to edit the type.

It holds custom abstract types of [[Author Type]]  [[Message Type]].

```graphql
GraphQLObjectType ChatroomType:
    name: "Chatroom"
    fields:
        id:
            type: GraphQLString
        chatroomUsers:
            type: GraphQLList(AuthorType)
        messages:
            type: GraphQLList(MessageType)
        lastMessage:
            type: MessageType
```

