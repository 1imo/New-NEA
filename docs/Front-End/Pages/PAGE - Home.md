
__Path__: /
__Intention__: Display the user's feed

### External Components Used

- [[Nav Component]]
- [[Post Component]]
- [[DiscoverProfile Component]]
- [[Loading Component]]

![[Pasted image 20240224220038.png]]

![[Pasted image 20240224220127.png]]


### Analysis

The home page. The first screen users will see after sign in and the hub for all things to do with the feed and the community overall. It must display the nav and the feed across all screen sizes and remain easy to navigate, minimal and pleasing to the eye.


### Design
#### On First Render

On the first render, to accommodate for for the [[Auth System#Google]], we must check the URL string for potential credentials. This is an extremely weak and insecure method of authentication, and it also affects performance, however, for now it shall stay.

The user's feed is also fetched from [[User Queries#getFeed]]. Auth details are retrieved from [[INDEX - Context]] if they exist. Vars is a value stored in cookies. It represents the feed type which the user would like to see. By default it is null and therefore if so, a standard recommended feed is requested. Otherwise, the type which the user chose in the [[PAGE - Settings]] will be used.

```
Call GET_FEED function:
    Parameters:
        id = AuthUserID
        secretkey = AuthSecretKey
        type = vars or "Recommended"
```

If there is an error fetching the data, the user will be made aware with a simple alert() whilst in beta.

```
if (error) alert("Error Loading Feed")
```

Whilst the feed is loading the [[Loading Component]] is displayed.

![[Pasted image 20240224220718.png]]


#### Feed

The feed is a mapping of [[Post Component]]s that have been arranged vertically in a container. If there are more than 3 posts, a [[DiscoverProfile Component]] is placed underneath the third post in order for users to foster new connections.

If no data is returned from the API as a result of 0 posts according to the parameters that they had picked, they are made aware with a message letting them know that they should follow some users and presenting them with the [[DiscoverProfile Component]].


#### UI

##### Mobile

![[Pasted image 20240226221105.png]]

##### Desktop

![[Pasted image 20240224193744.png]]


### Tests

#### Test Case 1: Rendering and Display

**Procedure:**
1. Render the `Home` component.
2. Observe the displayed content.

**Expected Result:**
- The component should render without crashing.
- If there are posts available in the feed, they should be displayed.
- If there are no posts available in the feed, a message encouraging the user to follow someone active should be displayed along with a discover profile option.

#### Test Case 2: Loading Feed

**Procedure:**
1. Render the `Home` component.
2. Observe the loading process.

**Expected Result:**
- The component should display a loading indicator while loading the feed.
- Once the feed is loaded, it should be displayed.

#### Test Case 3: Handling Errors

**Procedure:**
1. Render the `Home` component.
2. Simulate an error during the loading of the feed.

**Expected Result:**
- If an error occurs during the loading of the feed, an error alert should be displayed.
- The component should gracefully handle errors without crashing.
