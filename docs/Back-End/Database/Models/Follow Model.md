
### Analysis

Connections between users must be stored in a medium that except that it is a one-way connection for the time being. It must contain references to both users and the state of the relationship with a boolean.


### Design

#### id
__Defaults to__: UUID
__Type__: String

#### follower
__Type__: [[Database/Models/User Model|User Model]]
__Relation__: [[#following]]
__Fields__: [[#followerId]]
__References__: [[User Model#id]]

#### followerId
__Type__: String


#### following
__Type__: [[Database/Models/User Model|User Model]]
__Relation__: [[#following]]
__Fields__: [[#followingId]]
__References__: [[User Model#id]] 

#### followingId
__Type__: String


#### denial
__Defaults to__: false
__Type__: Boolean


![[Pasted image 20240226161516.png]]


### Implementation

```
model Follow {
  id          String  @id @default(uuid())
  follower    User    @relation("Following", fields: [followerId], references: [id])
  followerId  String
  following   User    @relation("Follower", fields: [followingId], references: [id])
  followingId String
  denial      Boolean @default(false)

  @@unique([followerId, followingId, id])
}
```

```
CREATE TABLE "Follow" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "followerId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    "followingId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    "denial" BOOLEAN DEFAULT false NOT NULL,
    UNIQUE ("followerId", "followingId", "id")
);
```


### Tests

#### Test Case 1: Add a new follow relationship

**Procedure**:
1. Insert a new record into the Follow table with valid follower ID, following ID, and a unique ID.
2. Retrieve the inserted record from the Follow table.
**Expected Result**:
1. The inserted record should exist in the Follow table.
2. The retrieved record should match the inserted record in terms of follower ID, following ID, and ID.


#### Test Case 2: Retrieve follow relationship by follower ID and following ID

**Procedure**:
1. Insert multiple records into the Follow table with different follower IDs, following IDs, and unique IDs.
2. Retrieve the records from the Follow table using a specific follower ID and following ID.
**Expected Result**:
1. All inserted records should exist in the Follow table.
2. The retrieved records should belong to the specified follower ID and following ID.


#### Test Case 3: Update denial status of a follow relationship

**Procedure**:
1. Insert a new record into the Follow table with valid follower ID, following ID, and a unique ID.
2. Update the denial status of the inserted record.
3. Retrieve the updated record from the Follow table.
**Expected Result**:
1. The inserted record should exist in the Follow table.
2. The denial status of the inserted record should be updated.
3. The retrieved record should reflect the updated denial status.
