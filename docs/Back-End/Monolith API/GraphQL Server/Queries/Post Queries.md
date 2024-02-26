Since a social media is usually only as good as it's network of users, as an incentive to spur new users to join the site, I have decided to allow posts to be publicly viewable if on their own dedicated page. The page also serves as a nice area for screenshots.


### getPost

Returns a post of specified ID to user. They are of a numbered format so that people can maybe appear on a random one if the decide to play around with the URL paths.

#### Analysis

Posts must be retrieved from an endpoint that doesn't require authentication for promoting the freedom of information.


#### Design

![[Pasted image 20240223221629.png]]

```
Define getPost:
    Type: PostType
    Arguments:
        id:
            Type: Int
    Resolve asynchronously:
        Try:
            Sanitise args
            Fetch post from Prisma:
                Where id equals args.id
                Select id, content, photo, and user details
            Return post
        Catch error:
            Log error
            Return
```


#### Tests

##### Test Case 1: Retrieve Post by ID

**Procedure:**
1. Provide a valid post ID as an argument.
2. Call the `getPost` resolver with the provided post ID.

**Expected Result:**
- The resolver should return the post corresponding to the provided ID.
- The returned post should include its ID, content, photo, and details of the user who created the post.


##### Test Case 2: Post Not Found

**Procedure:**
1. Provide a non-existent post ID as an argument.
2. Call the `getPost` resolver with the provided post ID.

**Expected Result:**
- The resolver should return null or an empty response since the post with the provided ID does not exist.


##### Test Case 3: Invalid Post ID Format

**Procedure:**
1. Provide an invalid format for the post ID (e.g., a string instead of an integer).
2. Call the `getPost` resolver with the invalid post ID.

**Expected Result:**
- The resolver should throw an error or return null since the provided post ID format is invalid.