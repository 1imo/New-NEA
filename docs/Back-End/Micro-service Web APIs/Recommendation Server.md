
The Recommendation Server is a micro-service I wrote in Rust to facilitate for a module dedicated primarily to data analysis in a separate module. For now it utilizes the basics of graph theory to sort through social networks that have been passed into it.


### API Architecture & Set Up

Create a HTTP POST route for /recommend. Improving security will save a lot of resources by adjusting the CORS to only accept requests from the [[INDEX - Monolith API]] as that is the only place requests should be made from.

```plaintext
Define the main function as asynchronous:
    Create a new CorsLayer and allow it to use methods: GET, POST

    Create a new Router for the application
    Add a route "/recommend" with the handler recommend for POST requests
    Add the CorsLayer to the application

    Print "Running on URL ADDRESS

    Bind the server to address URL ADDRESS and serve the application
End of main function
```


### User

The user is the centre of their network so I have created a User class with related functions.

![[Pasted image 20240224140627.png]]

The friends and following attributes are optional in the case that a user doesn't have any.

##### create_connection

Creates connections between users, one-way if they have a follow relationship two-ways if they are friends. It does does by iterating through the friends, then following and inserting the IDs into a hashmap.

![[Pasted image 20240224143535.png]]

```plaintext
Define a function named create_connection that takes a mutable reference to a HashMap of String keys and HashSet values called graph and does the following:
    If the optional field friends of the struct is true:
        Iterate over each friend_id in the friends:
            Insert self.id into the graph with an empty HashSet if it doesn't exist and then insert the friend_id into the HashSet
            Insert the friend_id into the graph with an empty HashSet if it doesn't exist and then insert self.id into the HashSet
    If the optional field following of the struct is true:
        Iterate over each follow_id in the following:
            Insert self.id into the graph with an empty HashSet if it doesn't exist and then insert the follow_id into the HashSet
            Insert the follow_id into the graph with an empty HashSet if it doesn't exist and then insert self.id into the HashSet
End of function definition
```


##### find_mutual_connections

This method aims to find mutual connections between users by efficiently traversing the graph and excluding connections that are already directly connected to the user, producing a layer of social connections 1 layer away from the user.

![[Pasted image 20240224144822.png]]

```plaintext
Define a function named find_mutual_connections that takes a reference to a HashMap of String keys and HashSet values called graph and returns a HashMap of String keys and usize values:
    Create a new HashMap named mutual_connections with String keys and usize values
        
    If the optional field connections of the struct with key self.id exists in the graph:
        Iterate over each connection_id in the connections:
            If the optional field connections_of_connection of the struct with key connection_id exists in the graph:
                Iterate over each mutual_connection_id in the connections_of_connection:
                    If mutual_connection_id is not equal to self.id and mutual_connection_id is not already in the connections:
                        Insert mutual_connection_id into the mutual_connections HashMap or increment its value by 1 if it already exists
    Return the mutual_connections HashMap
End of function definition
```


### recommend()

This is the function called upon a request for /recommend. It receives a JSON input of an array of users with their friends and following.

![[Pasted image 20240224145605.png]]

Then for every user it calls [[#create_connection]], creating a graph between users. Then we proceed to [[#find_mutual_connections]] and return them to the client in order of the most connected.

```plaintext
Define an asynchronous function named recommend that takes a Json containing a vector of User objects and returns something that can be converted into a response:

    Create a new HashMap named graph with String keys and HashSet values.
    Iterate over each user in the users vector:
        Call the create_connection method on the user, passing a mutable reference to the graph.

    If the users vector is not empty:
        Retrieve the first user from the users vector and store it in the variable user.
        Find mutual connections for the user in the graph and store the result in the variable mutual_connections.
        If the user's direct connections exist in the graph:
            Iterate over each direct connection in the user's direct connections:
                Remove the direct connection from the mutual connections.

        Convert the mutual connections into a sorted vector of user IDs based on their length in descending order and store it in the variable sorted_mutual_connections.

        Convert the sorted_mutual_connections vector into a JSON string and store it in the variable json_string.
        If the conversion to JSON is successful:
            Create a Body from the JSON string.
        Otherwise, if an error occurs during the conversion:
            Print an error message.
            Create an empty Body.

        Build a response with status OK, Content-Type header set to "application/json", and the body containing the JSON data.

    If the users vector is empty:
        Build a response with status OK and an empty body.

End of function definition
```

![[Pasted image 20240224150253.png]]