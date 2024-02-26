
### Analysis

In order to create a means of communication between users and establish a community, there has to be a specific place for them to converse. It must have functionality for users to join as well as freely communicate among themselves instantly.

To establish such a model, there must be fields such as an unique ID to allow users to search and join. A means of storing joined users and to create infrastructure to potentially scale to multiple users in a chat as well as a store of the messages sent.

### Design

##### id
__Type__: String

##### date
__Type__: DateTime
__Default__: now()

##### chatroomUsers
__Type__: Array of [[ChatroomUser Model]]

##### messages
__Type__: Array of [[Message Model]]


![[Pasted image 20240226155414.png]]


### Implementation

```
model Chatroom {
  id            String         @id
  date          DateTime       @default(now()) @updatedAt
  chatroomUsers ChatroomUser[]
  messages      Message[]      @relation("Chatroom_Messages")
}
```

```
CREATE TABLE "Chatroom" (
    "id" VARCHAR(255) NOT NULL PRIMARY KEY,
    "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```


### Tests

#### Test Case 1: Create a new chatroom

**Procedure**:
1. Insert a new record into the Chatroom table with a unique ID and current timestamp.
**Expected Result**:
1. The inserted record should exist in the Chatroom table.

#### Test Case 2: Retrieve an existing chatroom by ID

**Procedure**:
1. Insert a new record into the Chatroom table with a unique ID and current timestamp.
2. Retrieve the inserted record from the Chatroom table using its ID.
**Expected Result**:
1. The inserted record should exist in the Chatroom table.
2. The retrieved record should match the inserted record in terms of ID and timestamp.