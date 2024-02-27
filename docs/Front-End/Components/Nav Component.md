
The Nav is the main way of navigating through the platform. Without it navigation is rather hard and I accept on some pages I do need to include back buttons as it gets rather tiring editing URL paths when the Nav isn't available.

The Nav gives user's a limited set of options so that they do not get confused as to how they should use the component.


### External Components Used

- [[Loading Component]]


### Analysis

Users don't know the URL routes for pages on a sit, especially if they are now. It is also tiring to change the paths by hand in the URL bar every time they would like to visit a page. This is why a navigation menu is needed in order to necessitate the transfer of users to at a minimum, the pages which provide the core functionality of the platform. In future, we see users feeding back to us that they also need a back button in this component which will help them further navigate the size with ease.


### Design

#### Props

![[Pasted image 20240225172523.png]]


#### Links

Component links towards the user's own [[PAGE - Profile]], [[PAGE - PostPost]], [[PAGE - Search]], [[PAGE - MessageList]], [[PAGE - Settings]].

![[Pasted image 20240225174151.png]]


#### Data Fetching

Data needs to be fetched from [[User Queries#navInfo]], or from local storage to populate the Nav with the user's name and username, also allowing us to fetch their profile picture if they have one. Whilst loading, the [[Loading Component]] is shown and the user is made aware if an error has occurred whilst fetching their data.


#### UI

![[Pasted image 20240225174044.png]]


### Tests

#### Test Case 1: Rendering User Information

**Procedure:**

1. Render the `Nav` component.
2. Verify that the user's profile image, name, and username are displayed correctly.
3. Check if clicking on the user's profile image or name navigates to the user's profile page.

**Expected Result:**

- The user's profile image, name, and username should be displayed accurately.
- Clicking on the user's profile image or name should navigate to the user's profile page.

#### Test Case 2: Rendering Navigation Icons

**Procedure:**

1. Render the `Nav` component with the `icons` prop set to `true`.
2. Verify that the navigation icons for creating a post, searching, messaging, and accessing settings are displayed.

**Expected Result:**

- The navigation icons should be displayed correctly, providing users with intuitive access to different functionalities.

#### Test Case 3: Rendering User Information and Navigation Icons

**Procedure:**

1. Render the `Nav` component without rendering the navigation icons.
2. Verify that the user's profile image, name, and username are displayed correctly.
3. Check if clicking on the user's profile image or name navigates to the user's profile page.
4. Ensure that the navigation icons for creating a post, searching, messaging, and accessing settings are not displayed.

**Expected Result:**

- The user's profile image, name, and username should be displayed accurately.
- Clicking on the user's profile image or name should navigate to the user's profile page.
- Navigation icons for creating a post, searching, messaging, and accessing settings should not be displayed.

#### Test Case 4: Error Handling

**Procedure:**

1. Simulate an error condition, such as a failed request to load user information or navigation data.
2. Check if the component handles the error gracefully, displaying an error message or retrying the action.

**Expected Result:**

- The component should handle errors gracefully, displaying an error message to the user or retrying the action if appropriate.