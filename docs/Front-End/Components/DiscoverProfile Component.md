
This component was created to give users the option to discover new users on the platform. It is the UI interface for data fetched from [[User Queries#recommendedUsers]]. In future iterations the user will be allowed to interface with the component by dragging across like the [[Slider Component]] and the projected pathway for [[ProfileInsight Component]]. For now, to achieve the same outcome, albeit with a potential for less users discovered due to the impatience of users but with the satisfaction of an animated element, this is how it will be implemented.

When I first started to think about this component, I knew I would need a queue data structure which would allow first-in-first-out data management. I had already made such a structure in Rust a few weeks before so I decided to implement this.

It wasn't the nicest thing I had every done, however, I converted the Rust queue into a WASM package and then communicated with the package from JavaScript. 

On initial render, it checks the session storage to see whether any recommendations are stored for this session so as to prevent needles API calls. If not a request is made to fetch them.

```
Invoke the useQuery hook with the DISCOVER_PEOPLE query and options object:
    - Provide variables:
        - id: Obtained from the Ctx (context) object, representing the current user's ID.
        - secretkey: Obtained from the Ctx object, representing the current user's secret key.
    - Set fetchPolicy to "cache-first".
```

![[Pasted image 20240225153554.png]]

Whilst the data is being fetched, the [[Loading Component]] is shown to the user and if there is an error, the user is made aware with an alert function. This instance of the [[Loading Component]] might be shown over, or under, other instances of the [[Loading Component]] because pages it is used on, employ the same strategies. However, users will not be aware of two loading states, nor will the know until both states have been satisfied.

```
if(loading) return <Loading />
if(err) alert("Error Loading Recommended Users")
```

Once the data has been retrieved, the WASM module is instantiated and a new circular queue structure of length 10 is created, the data `enqueued` and an interval loop is created in order to create animation frames.

The interval runs every 40ms to move the data 1px to the left. On every 96th call, the first element is `dequeued` and then `enqueued` to the end creating an endless cycle of 10 profiles.

```
Call the init() function and handle its Promise using the then() method:
    - Upon successful initialization, execute the callback function with the 'module' parameter.

Within the callback function:
    - Initialize the queue with a capacity of 10 using Queue.new(10).
    - Iterate over the recommended users obtained from the 'data' object:
        - For each user, stringify the user object and enqueue it into the queue.
    
    - Initialize a 'count' variable to 0 to keep track of the animation frame count.
    - Set up an animation interval using setInterval():
        - Increment the 'removeX.current' value by 1 to simulate the animation effect.
        - Increment the 'count' variable by 1 with each interval.
        - If the 'count' reaches 96 (representing a full animation cycle):
            - Shift the queue by dequeueing and immediately enqueueing the item to simulate animation loop.
            - Reset the 'count' to account for the loop.
            - Reset the 'removeX.current' value to 0 to restart the animation loop.

    - Return a cleanup function to clear the animation interval upon component unmounting.
```

![[Pasted image 20240225154528.png]]

### Use Cases

The component can be seen in action on the user's home page where it appears below the third post in the feed if there are any posts, and in the scenario that there are no posts too.


### UI

![[Pasted image 20240225154805.png]]
