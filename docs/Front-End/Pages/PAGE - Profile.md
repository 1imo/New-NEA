
__Path__: /profile/{:id}
__Intention__: Render User Profile

### External Components Used

- [[Loading Component]]
- [[ProfileInfo Component]]


### Analysis

To keep an identity on the platform users should be able to have a profile which displays their information and posts they have posted. It must allow users to follow, unfollow and befriend one another and in the future the UI might be updated if users would like to see changes.


### Design

```
Define a function named Profile:
    Retrieve the 'id' parameter from the URL using useParams().
    Define a state variable 'd' and initialize it with an empty string.
    Define a state variable 'reversed' and initialize it with an empty array.
    
    Send a query to fetch user posts using useQuery():
        Pass the 'GET_USERPOSTS' query and provide the 'username' variable.
    
    If there's an error, display an alert message.
    If the data is still loading, render a Loading component.

    Implement an effect that updates the 'd' state variable whenever the 'id' parameter changes.

    Implement another effect that updates the 'reversed' state variable when the post data is available:
        Map over the retrieved posts and create Post components for each.
        Reverse the order of the posts and update the 'reversed' state variable.

    Return:
        - Render the ProfileInfo component.
        - If there are posts available:
            Render the reversed array of Post components.
        - If there are no posts available:
            Render a message indicating that there are no posts to display.

Export the Profile function.
```

![[Pasted image 20240225033047.png]]


### UI

##### Mobile

![[Pasted image 20240226212414.png]]

##### Desktop

![[Pasted image 20240225033908.png]]

![[Pasted image 20240225033931.png]]


### Tests

#### Test Case 1: Load Profile Successfully

**Procedure:**
1. Render the `Profile` component.
2. Provide a valid profile ID through the URL parameters.
3. Allow the component to load.

**Expected Result:**
- The component should successfully load the profile page for the specified user.
- The profile information should be displayed, including username, name, bio, profile picture, etc.
- If the user has posted content, it should be fetched and displayed on the profile page.
- Each post should be rendered properly with all relevant details.

#### Test Case 2: Display Loading Indicator

**Procedure:**
1. Render the `Profile` component.
2. Provide a valid profile ID through the URL parameters.
3. Simulate the component loading.

**Expected Result:**
- While the component is loading, a loading indicator should be displayed to indicate that data is being fetched.
- Users should be informed that the page content is being loaded.

#### Test Case 3: Handle Error Loading Profile

**Procedure:**
1. Render the `Profile` component.
2. Provide an invalid profile ID through the URL parameters.
3. Simulate an error while fetching the profile data.

**Expected Result:**
- The component should display an alert message indicating an error occurred while loading the profile.
- Users should be informed about the error and may try accessing the profile again later.

#### Test Case 4: Display No Posts Message

**Procedure:**
1. Render the `Profile` component for a user who has not posted any content.
2. Provide a valid profile ID through the URL parameters.
3. Allow the component to load.

**Expected Result:**
- The component should display a message indicating that the user has not posted any content yet.
- Users should be informed that there are no posts to display for the profile.