
### Analysis

To create many-to-many relationships between users and chatroom there exists a need for an interface between the two entities - a bridge of sorts that prevents circular relationships.

To establish such a model there must be attributes liking the user and chatroom through IDs.


### Design

##### chatroom
__Type__: Chatroom
__Fields__: [[#chatroomId]]
__References__: [[Chatroom Model#id]]

##### chatroomId
__Type__: String

##### user
__Type__: User
__Fields__: [[#userId]]
__References__: [[User Model#id]]

##### userId
__Type__: String


![[Pasted image 20240226160534.png]]


### Implementation

```
model ChatroomUser {
  chatroom   Chatroom @relation(fields: [chatroomId], references: [id])
  chatroomId String
  user       User     @relation(fields: [userId], references: [id])
  userId     String

  @@id([chatroomId, userId])
}
```

```
CREATE TABLE "ChatroomUser" (
    "chatroomId" VARCHAR(255) NOT NULL REFERENCES "Chatroom"("id"),
    "userId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    PRIMARY KEY ("chatroomId", "userId")
);
```


### Tests

#### Test Case 1: Add a user to a chatroom

**Procedure**:
1. Insert a new record into the ChatroomUser table with a valid chatroom ID and user ID.
**Expected Result**:
1. The inserted record should exist in the ChatroomUser table.

#### Test Case 2: Retrieve users in a chatroom by chatroom ID

**Procedure**:
1. Insert multiple records into the ChatroomUser table with different chatroom IDs and user IDs.
2. Retrieve the records from the ChatroomUser table using a specific chatroom ID.
**Expected Result**:
1. All inserted records should exist in the ChatroomUser table.
2. The retrieved records should belong to the specified chatroom ID.

#### Test Case 3: Retrieve chatrooms associated with a user by user ID

**Procedure**:
1. Insert multiple records into the ChatroomUser table with different chatroom IDs and user IDs.
2. Retrieve the records from the ChatroomUser table using a specific user ID.
**Expected Result**:
1. All inserted records should exist in the ChatroomUser table.
2. The retrieved records should belong to the specified user ID.