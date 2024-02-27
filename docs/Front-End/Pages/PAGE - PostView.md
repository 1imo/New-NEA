
__Path__: /post/id/{:id}
__Intention__: To solely view a specific [[Post Component]]


To promote the sharing of data, this is displayed on an unprotected route. Further links from these posts require authentication and would like back to the [[PAGE - Portal]].


### External Components Used

- [[Post Component]]


### Analysis

To promote the sharing of information on the platform, even among those not signed in or without an account in an aesthetically minimal and responsive page.


### Design

Fetching post is done by querying the [[Post Queries#getPost]] by ID found in URL params.

![[Pasted image 20240225030330.png]]

```
Define a Component named PostView:
    Retrieve the 'id' parameter from the URL using useParams().
    Access the context object using useContext().

    Define a state variable 'vars' and initialize it with the parsed integer value of 'id'.
    
    Send a query to load the post data using useQuery():
        Pass the 'LOAD_POST' query and provide the 'id' variable.
    
    Implement an effect that updates the 'vars' state variable whenever the 'id' parameter changes.

    Return:
        - If the post data is available:
            Render the Post component with the data.
        - If the post data is not available:
            Render a message indicating that the post was not found.

Export the PostView function.

```


### UI

![[Pasted image 20240226213204.png]]

Nav is rendered only if user is signed in but, the idea of sharing data is not just for freedom of information but to also promote sign ups. I don't know yet.

![[Pasted image 20240225175638.png]]


### Tests

#### Test Case 1: Load Post Successfully

**Procedure:**
1. Render the `PostView` component.
2. Provide a valid post ID through the URL parameters.
3. Allow the component to load.

**Expected Result:**
- The component should successfully load the post with the specified ID.
- The post content, including title, author, date, body, etc., should be displayed.
- If the post belongs to the currently authenticated user, a navigation bar should be displayed.

#### Test Case 2: Display Loading Indicator

**Procedure:**
1. Render the `PostView` component.
2. Provide a valid post ID through the URL parameters.
3. Simulate the component loading.

**Expected Result:**
- While the component is loading, a loading indicator should be displayed to indicate that data is being fetched.
- Users should be informed that the post content is being loaded.

#### Test Case 3: Handle Error Loading Post

**Procedure:**
1. Render the `PostView` component.
2. Provide an invalid post ID through the URL parameters.
3. Simulate an error while fetching the post data.

**Expected Result:**
- The component should display a message indicating that the post with the specified ID was not found.
- Users should be informed about the error and may try accessing a different post.

#### Test Case 4: Display Navigation Bar for Authenticated User

**Procedure:**
1. Render the `PostView` component.
2. Provide a valid post ID through the URL parameters.
3. Ensure that there is an authenticated user context.

**Expected Result:**
- If there is an authenticated user context available, a navigation bar should be displayed.
- The navigation bar should contain relevant options such as home, profile, settings, etc.