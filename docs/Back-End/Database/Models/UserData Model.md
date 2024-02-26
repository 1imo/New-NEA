
### Analysis

Some user data will be too sensitive to store in the same table as the regular data such as hashed passwords and API keys per GDPR guidelines and therefore a new table needs to be established so as to facilitate this.


### Design

#### id
__Type__: String

Unique

#### user
__Type__: [[Back-End/Database/Models/User Model|User Model]]
__Relation__: One-to-One
__Fields__: [[#id]]
__References__: [[User Model#id]]

#### password
__Type__: String

Hashed user password

#### secretkey
__Type__: String

API key. This might be adjusted to it's own type to allow for automatic updating of the key


![[Pasted image 20240226165337.png]]


### Implementation

```
model UserData {
  id        String  @unique
  user      User    @relation(fields: [id], references: [id])
  password  String
  secretkey String?
}
```

```
CREATE TABLE UserData (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    secretkey VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES User(id)
);
```


### Tests

### Test Case 1: Create new user data record

**Procedure:**
1. Insert a new record into the UserData table with a unique ID, user_id, password, and secretkey.
2. Retrieve the inserted record from the UserData table.
**Expected Result:**
1. The inserted record should exist in the UserData table with a unique user_id.
2. The retrieved record should match the inserted record in terms of ID, user_id, password, and secretkey.


### Test Case 2: Create user data record with existing user_id

**Procedure:**
1. Attempt to insert a new record into the UserData table with an existing user_id.
2. Verify that the insertion operation fails and returns an error.
**Expected Result:**
1. The insertion operation should fail due to the unique constraint violation on the user_id column.
2. An error message indicating the unique constraint violation should be returned.


### Test Case 3: Update user data record

**Procedure:**
1. Update the password and secretkey fields for an existing user data record in the UserData table.
2. Retrieve the updated record from the UserData table.
**Expected Result:**
1. The password and secretkey fields for the user data record should be successfully updated.
2. The retrieved record should reflect the updated password and secretkey values.