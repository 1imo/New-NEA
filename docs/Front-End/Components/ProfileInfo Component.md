

### External Components Used

- [[Loading Component]]


The ProfileInfo Component was created to avoid over cluttering the [[PAGE - Profile]]. It is responsible for displaying the user's information of the profile they have visited. 


### Analysis

The component is the first thing you see when you view a user's profile therefore it contains information such as their name, username and profile picture along with the amount of followers and friends they have. Like always the design should be responsive and easy to navigate.


### Design

![[Pasted image 20240225191945.png]]


### On First Render

A query is sent that fetches the data from [[User Queries#getPublicInfo]] with a parameter which is the username fetched from the URL path.

![[Pasted image 20240225191442.png]]


### Functionality.

##### Follow & Following

Part of the [[Follows, Following & Friendships]] workflow, users can follow others by pressing the follow button. If they are not currently friends or following them, the [[User Mutations#followUnfollowUser]] will follow them and send a friend request, otherwise the current follow or friendship will be removed. After this has completed, the window will be refreshed to update the data.

```
await followUnfollow({
	variables: { id: Ctx.id, secretkey: Ctx.secretkey, username: d }
}).then(() => window.location.reload())
```


### Test

#### Test Case 1: Rendering Profile Information

**Procedure:**

1. Render the `ProfileInfo` component with mock data for a user's profile.
2. Ensure that the user's name, username, follower count, following count, and friend count are displayed correctly.
3. Check if the follow button is displayed.

**Expected Result:**

- The profile information should be displayed accurately.
- The follow button should be visible.

#### Test Case 2: Following a User

**Procedure:**

1. Render the `ProfileInfo` component with a mock user profile.
2. Click or tap the follow button.
3. Check if the follow button changes to indicate that the user is being followed.
4. Verify if the appropriate action is triggered to follow the user.

**Expected Result:**

- Upon clicking or tapping the follow button, it should change its state to indicate that the user is being followed.
- The appropriate action should be triggered to follow the user, and the UI should reflect this change.

#### Test Case 3: Unfollowing a User

**Procedure:**

1. Render the `ProfileInfo` component with a mock user profile.
2. Click or tap the follow button to follow the user.
3. Click or tap the follow button again to unfollow the user.
4. Check if the follow button changes back to its original state.

**Expected Result:**

- After clicking or tapping the follow button to unfollow the user, it should revert to its original state.
- The appropriate action should be triggered to unfollow the user, and the UI should reflect this change.

#### Test Case 4: Error Handling

**Procedure:**

1. Simulate an error condition, such as a failed request to load profile data.
2. Check if the component handles the error gracefully, displaying an error message or redirecting to an error page.

**Expected Result:**

- The component should handle errors gracefully, displaying an error message to the user or redirecting them to an error page.