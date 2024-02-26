
### Analysis

Messages need to hold information such as the time/ data they were sent, whether they have been read or not by the intended recipient, who it was sent by and which chatroom they pertain to.


### Design

#### id
__Type__: String
__Default__: uuid()

#### content
__Type__: String

#### sender
__Type__: [[User Model]]
__Fields__: [[#senderId]]
__References__: [[User Model#id]]

#### senderId
__Type__: String

#### date
__Type__: DateTime
__Default__: now()

#### read
__Type__: Boolean
__Default__: false

#### chatroom
__Type__: [[Chatroom Model]]
__Fields__: [[#chatroomId]]
__References__: [[Chatroom Model#id]]

#### chatroomId
__Type__: String


![[Pasted image 20240226163608.png]]


### Implementation

```
model Message {
  id         String    @id @default(uuid())
  content    String
  sender     User      @relation(fields: [senderId], references: [id])
  senderId   String
  date       DateTime  @default(now())
  read       Boolean   @default(false)
  chatroom   Chatroom? @relation("Chatroom_Messages", fields: [chatroomId], references: [id])
  chatroomId String?
}
```

```
CREATE TABLE "Message" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "senderId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "read" BOOLEAN DEFAULT false NOT NULL,
    "chatroomId" VARCHAR(255) REFERENCES "Chatroom"("id")
);
```


### Tests

### Test Case 1: Create a new message

**Procedure**:
1. Insert a new record into the Message table with a unique ID, non-empty content, valid senderId, and current timestamp.
2. Retrieve the inserted record from the Message table.
**Expected Result**:
1. The inserted record should exist in the Message table.
2. The retrieved record should match the inserted record in terms of ID, content, senderId, timestamp, and read status.

### Test Case 2: Update message read status

**Procedure**:
1. Insert a record into the Message table with the read status set to false.
2. Update the read status of the inserted record to true.
3. Retrieve the updated record from the Message table.
**Expected Result**:
1. The inserted record should exist in the Message table with the read status set to false.
2. After updating the read status, the retrieved record should have the read status set to true.

### Test Case 3: Delete a message

**Procedure**:
1. Insert a new record into the Message table.
2. Delete the inserted record from the Message table.
3. Attempt to retrieve the deleted record from the Message table.
**Expected Result**:
1. The inserted record should exist in the Message table before deletion.
2. After deletion, the record should no longer exist in the Message table.
3. Attempting to retrieve the deleted record should result in no record being returned.