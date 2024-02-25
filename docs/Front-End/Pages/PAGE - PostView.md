
__Path__: /post/id/{:id}
__Intention__: To solely view a specific [[Post Component]]


To promote the sharing of data, this is displayed on an unprotected route. Further links from these posts require authentication and would like back to the [[PAGE - Portal]].


### External Components Used

- [[Post Component]]


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

![[Pasted image 20240225031200.png]]

![[Pasted image 20240225031351.png]]

Nav is rendered only if user is signed in but, the idea of sharing data is not just for freedom of information but to also promote sign ups. I don't know yet.

![[Pasted image 20240225175638.png]]


