
### Analysis

Viewing posts should have their own structure so as to interface between users and posts without causing additional unneeded complexity to the data.


### Design

#### post
__Type__: [[Post Model]]
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


![[Pasted image 20240226170102.png]]


### Implementation

```
model ViewedPost {
  post   Post   @relation(fields: [postId], references: [id])
  postId Int
  user   User   @relation(fields: [userId], references: [id])
  userId String

  @@id([postId, userId])
}
```

```
CREATE TABLE "ViewedPost" (
    "postId" INTEGER NOT NULL REFERENCES "Post"("id"),
    "userId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    PRIMARY KEY ("postId", "userId")
);
```


### Tests

#### Test Case 1: Create new viewed post record

**Procedure:**
1. Insert a new record into the ViewedPost table with a postId and userId.
2. Retrieve the inserted record from the ViewedPost table.
**Expected Result:**
1. The inserted record should exist in the ViewedPost table with the specified postId and userId.
2. The retrieved record should match the inserted record in terms of postId and userId.


#### Test Case 2: Create duplicate viewed post record

**Procedure:**
1. Attempt to insert a new record into the ViewedPost table with the same postId and userId as an existing record.
2. Verify that the insertion operation fails due to the primary key constraint violation.
**Expected Result:**
1. The insertion operation should fail due to the primary key constraint violation on the combination of postId and userId.
2. An error message indicating the primary key constraint violation should be returned.


#### Test Case 3: Retrieve viewed post record

**Procedure:**
1. Retrieve an existing viewed post record from the ViewedPost table using a postId and userId.
2. Verify that the retrieved record matches the expected record.
**Expected Result:**
1. The retrieved record should exist in the ViewedPost table with the specified postId and userId.
2. The retrieved record should match the expected record in terms of postId and userId.