
__Path__: /
__Intention__: Display the user's feed

### External Components Used

- [[Nav Component]]
- [[Post Component]]
- [[DiscoverProfile Component]]
- [[Loading Component]]

![[Pasted image 20240224220038.png]]

![[Pasted image 20240224220127.png]]


### On First Render

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


### Feed

The feed is a mapping of [[Post Component]]s that have been arranged vertically in a container. If there are more than 3 posts, a [[DiscoverProfile Component]] is placed underneath the third post in order for users to foster new connections.

If no data is returned from the API as a result of 0 posts according to the parameters that they had picked, they are made aware with a message letting them know that they should follow some users and presenting them with the [[DiscoverProfile Component]].


### UI

##### Mobile

![[Pasted image 20240224193720.png]]

![[Pasted image 20240224212912.png]]
##### Desktop

![[Pasted image 20240224193744.png]]


