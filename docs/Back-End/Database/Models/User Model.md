
### Analysis

Users, the centre-most entity on the platform. Everything revolves around them, and therefore everything should be designed around them from the retrieval of chatrooms that they are in, to their posts. All users have name and usernames and they should have performance metrics so that their posts performances act accordingly so as to promote content people want to see and feel to be solid.


### Design

#### id
__Defaults to__: UUID (natural function)
__Type__: String

Unique ID in the table. Index of Model

#### username
__Type__: String

Unique username in the table. Compound index of Model

#### name
__Type__: String
Name of user

#### userData
__Type__: [[UserData Model]]

#### posts
__Type__: Array of [[Post Model]]

#### viewedPosts
__Type__: Array of [[ViewedPost Model]]

#### likedPosts
__Type__: Array of [[LikedPost Model]]

#### friends
__Type__: Array of [[Friendship Model]]
__Relation__: [[Friendship Model#userOne]]

#### friendshipsReceived
__Type__: Array of [[Friendship Model]]
__Relation__: [[Friendship Model#userTwo]]

#### following
__Type__: Array of [[Follow Model]]
__Relation__: "Following"

#### followers
__Type__: Array of [[Follow Model]]
__Relation__: "Follower"

#### chatroomUsers
__Type__: Array of [[ChatroomUser Model]]

#### avgRatio
__Type__: Float
__Default__: 0.0

The avgRatio attribute of a User relates to their performance on the platform. It comes as the result of a combination of factors such as post count

#### multiplier
__Type__: Float
__Default__: 1.0

Backbone for potential stream of revenue by using it to promote posts in a user's feed.

#### socket
__Type__: String
Currently connected, or last used socket ID

#### Message
__Type__: Array of [[Message Model]]

#### lastUpdated
__Defaults to__: now()
__Type__: DateTime

Last time the model was updated



### Implementation

```
model User {
  id                  String         @unique @default(uuid())
  username            String         @unique
  name                String
  userData            UserData?
  posts               Post[]
  viewedPosts         ViewedPost[]
  likedPosts          LikedPost[]
  friends             Friendship[]   @relation("User_One")
  friendshipsReceived Friendship[]   @relation("User_Two")
  following           Follow[]       @relation("Following")
  followers           Follow[]       @relation("Follower")
  chatroomUsers       ChatroomUser[]
  avgRatio            Float          @default(0.0)
  multiplier          Float          @default(1.0)
  socket              String?
  Message             Message[]
  lastUpdated         DateTime       @default(now()) @updatedAt

  @@index([username, id])
}
```

```
CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "avgRatio" FLOAT DEFAULT 0.0 NOT NULL,
    "multiplier" FLOAT DEFAULT 1.0 NOT NULL,
    "socket" TEXT,
    "lastUpdated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE ("username", "id")
);
```


### Tests

#### Test Case 1: Create a new user with unique username

**Procedure:**
1. Insert a new record into the User table with a unique ID, username, name, default average ratio, default multiplier, and current timestamp.
2. Retrieve the inserted record from the User table.
**Expected Result:**
1. The inserted record should exist in the User table with a unique username.
2. The retrieved record should match the inserted record in terms of ID, username, name, default average ratio, default multiplier, and timestamp.


#### Test Case 2: Create a new user with existing username

**Procedure:**
1. Attempt to insert a new record into the User table with an existing username.
2. Verify that the insertion operation fails and returns an error.
**Expected Result:**
1. The insertion operation should fail due to the unique constraint violation on the username column.
2. An error message indicating the unique constraint violation should be returned.


#### Test Case 3: Update user's average ratio and multiplier

**Procedure:**
1. Update the average ratio and multiplier fields for an existing user in the User table.
2. Retrieve the updated record from the User table.
**Expected Result:**
1. The average ratio and multiplier fields for the user should be successfully updated.
2. The retrieved record should reflect the updated average ratio and multiplier values.