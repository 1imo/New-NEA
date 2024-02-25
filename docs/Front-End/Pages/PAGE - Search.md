
__Path__: /search
__Intention__: Search implemented for different use cases such as user search for messages or profiles.


### External Components Used

- [[ProfileInsight Component]]


### Search Type

The page is a multi-functional search used for referring people to peoples' profiles and creating chats with them. Due to it's re-usability, I have passed information as to the search type through the useLocation() function which I thought would be a cleaner implementation that setting something else up in the Context. This `state` is then passed into the [[ProfileInsight Component]] which helps decide on next steps. If `state` does not exist, `main` will be used.

```
const location = useLocation()
const state = location.state

<ProfileInsight username={res.username} name={res.name} id={res.id} key={index} reference={state.searchType || "main"}/>
}
```



### Searching

[[User Queries#getUserSearchResults]] is called to return search results every time the input changes. Sanitized API side but would be better to do so here also. 

```
Call GET_SEARCH_INSIGHTDATA function:
    Parameters:
        username = searchTerm
        type = state.searchType or "main"
```


### UI

##### Mobile
![[Pasted image 20240225041310.png]]

##### Desktop
![[Pasted image 20240225041331.png]]