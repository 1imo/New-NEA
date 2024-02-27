
Component designed to render the a Post in the viewport.


### Analysis

Posts need to be contained in a responsive container which add functionality to them such as liking and viewing among potentially sharing content among others.


### Design
#### Props

![[Pasted image 20240225175237.png]]


#### Functionality

##### Dedicated Page View

By tapping on the post, the user will be taken to the [[PAGE - PostView]]

```
onClick={() => navigate(`/post/id/${props?.data?.id}`)}
```

##### Like

By double tapping the post component, the User will leave a like on the post. Right now the user receives no feedback and as per the [[Mission]], no like counter is shown. [[Post Mutations#postLiked]]

```
Async function like():
    Set liking state to true to indicate that the like operation is in progress
    Execute postLiked mutation to indicate that the user has liked the post:
        - Pass variables (id, secretkey, post) to the mutation representing user ID, secret key, and post ID respectively
        - Await the response from the mutation

    If response exists:
        Set liking state to false to indicate that the like operation is complete
```


##### View

When the post is in the observable viewport, it is recorded and the post's stored information is stored accordingly. [[Post Mutations#postViewed]]

```
await postViewed({variables: { post, secretkey, id }})
```


##### Viewing Media

In the props, if a boolean flag of true is passed with the photo key, the [[Image Server]] is then queried for the corresponding media and attatched.

```
<div style={{backgroundImage: `url(${Ctx.imageServer}/fetch/post/${props?.data?.id})`, backgroundSize: "cover", aspectRatio: "1/1", height: "100% !important", marginTop: 8, borderRadius: 8, display: !props?.data?.photo ? "none" : null}}>&nbsp;</div>
```


#### UI

![[Pasted image 20240225190130.png]]


### Tests

#### Test Case 1: Rendering Post Information

**Procedure:**

1. Render the `Post` component with mock data for a post.
2. Ensure that the post's user profile image, name, username, content, and associated image (if any) are displayed correctly.
3. Verify that the post is clickable, allowing navigation to the post details page.
4. Check if double-clicking on the post triggers the like function.

**Expected Result:**

- The post information should be displayed accurately.
- Clicking on the post should navigate to the post details page.
- Double-clicking on the post should trigger the like function.

#### Test Case 2: Viewing Post Details

**Procedure:**

1. Render the `Post` component with mock data for a post.
2. Click on the post to navigate to the post details page.
3. Verify that the navigation occurs correctly.

**Expected Result:**

- Clicking on the post should navigate to the post details page, displaying additional information about the post.

#### Test Case 3: Liking a Post

**Procedure:**

1. Render the `Post` component with mock data for a post.
2. Double-click on the post to trigger the like function.
3. Check if the like animation is displayed.

**Expected Result:**

- Double-clicking on the post should trigger the like function, displaying the like animation.
- The like action should be successfully executed, updating the post's like count if applicable.

#### Test Case 4: Error Handling

**Procedure:**

1. Simulate an error condition, such as a failed request to load post data or like the post.
2. Check if the component handles the error gracefully, displaying an error message or retrying the action.

**Expected Result:**

- The component should handle errors gracefully, displaying an error message to the user or retrying the action if appropriate.