
__Path__: /profile/{:id}
__Intention__: Render User Profile

### External Components Used

- [[Loading Component]]
- [[ProfileInfo Component]]

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

![[Pasted image 20240225033209.png]]

![[Pasted image 20240225033748.png]]

##### Desktop

![[Pasted image 20240225033908.png]]

![[Pasted image 20240225033931.png]]
