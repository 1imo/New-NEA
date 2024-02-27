
__Path__: /search
__Intention__: Search implemented for different use cases such as user search for messages or profiles.


### External Components Used

- [[ProfileInsight Component]]


### Analysis

To navigate across the site and discover new content and users, the users must be given a search interface. To aide in development and speed up future search implementations on the platform, this component must be reusable as long as it doesn't get too complex.


### Design

#### Search Type

The page is a multi-functional search used for referring people to peoples' profiles and creating chats with them. Due to it's re-usability, I have passed information as to the search type through the useLocation() function which I thought would be a cleaner implementation that setting something else up in the Context. This `state` is then passed into the [[ProfileInsight Component]] which helps decide on next steps. If `state` does not exist, `main` will be used.

```
const location = useLocation()
const state = location.state

<ProfileInsight username={res.username} name={res.name} id={res.id} key={index} reference={state.searchType || "main"}/>
}
```



#### Searching

[[User Queries#getUserSearchResults]] is called to return search results every time the input changes. Sanitized API side but would be better to do so here also. 

```
Call GET_SEARCH_INSIGHTDATA function:
    Parameters:
        username = searchTerm
        type = state.searchType or "main"
```


#### UI

##### Mobile
![[Pasted image 20240225041310.png]]

##### Desktop
![[Pasted image 20240225041331.png]]


### Tests

#### Test Case 1: Search for User Successfully

**Procedure:**
1. Render the `Search` component.
2. Enter a valid username in the search input.
3. Press Enter or click outside the input field.

**Expected Result:**
- The component should display search results for the entered username.
- The search results should include the username, name, and profile ID of the user.
- Each search result should be clickable and lead to the corresponding user's profile page.

#### Test Case 2: Display Default Search Results

**Procedure:**
1. Render the `Search` component without providing a search term.
2. Allow the component to load.

**Expected Result:**
- The component should display default search results based on the default search type ("main").
- The default search results should include users or items relevant to the main search category.
- Each default search result should be clickable and lead to the corresponding user's profile or item page.

#### Test Case 3: Handle Error Loading Search Results

**Procedure:**
1. Render the `Search` component.
2. Simulate an error while loading search results.

**Expected Result:**
- The component should display an alert message indicating an error occurred while loading search results.
- The user should be informed about the error and may retry the search later.