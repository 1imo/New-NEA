
### Analysis

Posts are one of the centre points of any social media platform. They are a means of non-intrusive communication and allow interaction between users from a distance. They must be able to hold different kinds of communication such as photos, the poster's ID and it's performance rankings in the system.


### Design

#### id
__Type__: Int
__Default__: autoincrement()

Unique and auto-increments to allow for intentional sharing of posts.

#### content
__Type__: String

Text body of the post. For now restrictions keep user input at around 100 chars

#### photo
__Type__: Boolean
__Default__: false

Shows whether there is media associated with the post and whether to fetch it from [[Image Server]]

#### user
__Type__: User
__Fields__: [[#userId]]
__References__: [[User Model#posts]]

#### userId
__Type__: String

#### date
__Type__: DateTime
__Default__: now()

Date & time posted/ created

#### likedBy
__Type__: Array of [[LikedPost Model]]
__Relation__: One-to-Many

#### viewedBy
__Type__: Array of [[ViewedPost Model]]
__Relation__: One-to-Many

#### avgRatio
__Type__: Float
__Default__: 0.0

Performance indicator of the post

#### multiplier
__Type__: Float
__Default__: 1.0

Specific performance enhancing boost, able to be boosted by a user in the future if revenue is needed.


![[Pasted image 20240226164118.png]]


### Implementation

```
model Post {
  id         Int          @id @default(autoincrement())
  content    String
  photo      Boolean      @default(false)
  user       User         @relation(fields: [userId], references: [id])
  userId     String
  date       DateTime     @default(now())
  likedBy    LikedPost[]
  viewedBy   ViewedPost[]
  avgRatio   Float        @default(0.0)
  multiplier Float        @default(1.0) // Ensure decimal point
}
```

```
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "photo" BOOLEAN DEFAULT false NOT NULL,
    "userId" VARCHAR(36) NOT NULL REFERENCES "User"("id"),
    "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "avgRatio" FLOAT DEFAULT 0.0 NOT NULL,
    "multiplier" FLOAT DEFAULT 1.0 NOT NULL
);
```


### Tests

#### Test Case 1: Create a new post with photo

**Procedure:**
1. Insert a new record into the Post table with a unique ID, content, user ID, photo set to true, and current timestamp.
2. Retrieve the inserted record from the Post table.
**Expected Result:**
1. The inserted record should exist in the Post table with the photo field set to true.
2. The retrieved record should match the inserted record in terms of ID, content, user ID, and timestamp.


#### Test Case 2: Create a new post without photo

**Procedure:**
1. Insert a new record into the Post table with a unique ID, content, user ID, photo set to false, and current timestamp.
2. Retrieve the inserted record from the Post table.
**Expected Result:**
1. The inserted record should exist in the Post table with the photo field set to false.
2. The retrieved record should match the inserted record in terms of ID, content, user ID, and timestamp.


#### Test Case 3: Create a new post with custom average ratio and multiplier

**Procedure:**
1. Insert a new record into the Post table with a unique ID, content, user ID, custom average ratio, custom multiplier, and current timestamp.
2. Retrieve the inserted record from the Post table.
**Expected Result:**
1. The inserted record should exist in the Post table with the specified average ratio and multiplier.
2. The retrieved record should match the inserted record in terms of ID, content, user ID, average ratio, multiplier, and timestamp.