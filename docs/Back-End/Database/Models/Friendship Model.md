
### Analysis

For separation between simple, generic follows and upgraded relationships, there needs to be a separate entity storing the data.


### Design

#### id
__Defaults to__: UUID
__Type__: String

#### userOne
__Type__: User
__Relation__: [[Back-End/Database/Models/User Model|User Model]]
__Fields__: [[#userOneId]]
__References__: [[User Model#id]]

#### userOneId
__Type__: String

#### userTwo
__Type__: User
__Relation__: [[Back-End/Database/Models/User Model|User Model]]
__Fields__: [[#userTwoId]]
__References__: [[User Model#id]]

#### userTwoId
__Type__: String


![[Pasted image 20240226162359.png]]


### Implementation

```
model Friendship {
  id        String @id @default(uuid())
  userOne   User   @relation("User_One", fields: [userOneId], references: [id])
  userOneId String
  userTwo   User   @relation("User_Two", fields: [userTwoId], references: [id])
  userTwoId String

  @@unique([userOneId, userTwoId, id])
}
```

```
CREATE TABLE "Friendship" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "userOneId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    "userTwoId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    UNIQUE ("userOneId", "userTwoId", "id")
);
```


### Tests

#### Test Case 1: Create a new friendship relationship

**Procedure**:
1. Insert a new record into the Friendship table with valid userOneId, userTwoId, and a unique ID.
2. Retrieve the inserted record from the Friendship table.
**Expected Result**:
1. The inserted record should exist in the Friendship table.
2. The retrieved record should match the inserted record in terms of userOneId, userTwoId, and ID.


#### Test Case 2: Retrieve friendship relationship by userOneId and userTwoId

**Procedure**:
1. Insert multiple records into the Friendship table with different userOneIds, userTwoIds, and unique IDs.
2. Retrieve the records from the Friendship table using a specific userOneId and userTwoId.
**Expected Result**:
1. All inserted records should exist in the Friendship table.
2. The retrieved records should belong to the specified userOneId and userTwoId.


#### Test Case 3: Attempt to create duplicate friendship relationship

**Procedure**:
1. Insert a record into the Friendship table with a userOneId and userTwoId that already exist in another record.
2. Retrieve the inserted record from the Friendship table.
**Expected Result**:
1. The insertion operation should fail due to the UNIQUE constraint violation.
2. No record should be inserted into the Friendship table.
3. An error or exception should be raised indicating the constraint violation.