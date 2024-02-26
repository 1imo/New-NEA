
### Analysis

Information as to the likes of a post must be stored in a separate table so as to in future, potentially scale the liking system and have likes hold different weights affecting the post's performance more accordingly. Such as scenarios where user's don't like as many posts as others. This might be to do with not liking their feed or rather being extremely selective therefore their like holds more weight. It also allows for future curated feed implementation. There must be fields tying the like to each individual user to allow easy data access.


### Design

#### post
__Type__: Post
__Fields__: [[#postId]]
__References__: [[Post Model#id]]

#### postId
__Type__: Int

#### user
__Type__: [[User Model]]
__Fields__: [[#userId]]
__References__: [[User Model#id]]

#### userId
__Type__: String


![[Pasted image 20240226162942.png]]


### Implementation

```
model LikedPost {
  post   Post   @relation(fields: [postId], references: [id])
  postId Int
  user   User   @relation(fields: [userId], references: [id])
  userId String

  @@id([postId, userId])
}
```

```
CREATE TABLE "LikedPost" (
    "postId" INTEGER NOT NULL REFERENCES "Post"("id"),
    "userId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    PRIMARY KEY ("postId", "userId")
);
```


### Tests

#### Test Case 1: Create a new liked post relationship

**Procedure**
1. Insert a new record into the LikedPost table with a valid postId, userId, and unique primary key.
2. Retrieve the inserted record from the LikedPost table.
**Expected Result**:
1. The inserted record should exist in the LikedPost table.
2. The retrieved record should match the inserted record in terms of postId, userId, and primary key.


#### Test Case 2: Retrieve liked posts by user

**Procedure**:
1. Insert multiple records into the LikedPost table with different userIds and postId.
2. Retrieve the records from the LikedPost table using a specific userId.
**Expected Result**:
1. All inserted records should exist in the LikedPost table.
2. The retrieved records should belong to the specified userId.


#### Test Case 3: Attempt to like the same post twice

**Procedure**:
1. Insert a record into the LikedPost table with a postId and userId that already exist in another record.
2. Retrieve the inserted record from the LikedPost table.
**Expected Result**:
1. The insertion operation should fail due to the PRIMARY KEY constraint violation.
2. No record should be inserted into the LikedPost table.
3. An error or exception should be raised indicating the constraint violation.