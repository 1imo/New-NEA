
__Path__: /portal
__Intention__: Gives users options to sign up and sign in

Users are given the option to sign in with the [[Auth System]] through Google SignIn with Oauth, however, right now it isn't exactly secure due to the transmission of credentials through URL addresses which is why the button has been disabled temporarily. Users can also [[#sign in]] with their platform credentials and [[#sign up.]]

After making the [[DiscoverProfile Component]], I was inspired to make an [[#animation ]]for the portal too, however, instead of interfacing with the [[Circular Queue]] package I wrote in Rust, I opted to do the same in React so as to not link the page to anything that is hidden behind authentication [[INDEX - Front-End]].


### Links To

- [[PAGE - SignIn]]
- [[PAGE - Onboarding]]

![[Pasted image 20240225021339.png]]


### On First Render

We create a function that will run periodically, every 40ms, in order to create animation frames. This interval aims to adjust the X position of elements to move them horizontally. Every time the function is ran, the elements move by 1px. Every 96th time, they have moved forward by an entire position and pop the first one to the rear of the queue creating a circular queue like the [[Circular Queue]] module.

```
Define a Portal component:
    Initialize images as a reference to an array of image paths.
    Initialize queueTop as a reference to the current images.
    Initialize removeX as a reference to 0.
    Initialize queueBottom as a reference to a new array derived from reversing images.

    Define an effect:
        Start a count at 0.
        Set an animation interval to run every 40 milliseconds:
            Increment removeX by 1.
            Increment count by 1.
            If removeX reaches 96:
                Remove the first item from queueTop and append it to the end.
                Remove the last item from queueBottom and prepend it to the beginning.
                Subtract 96 from count.
                Reset removeX to removeX - 96.
        Cleanup by clearing the animation interval
```


### UI

##### Initial 

![[Pasted image 20240225020532.png]]

![[Pasted image 20240225020639.png]]

![[Pasted image 20240225020737.png]]

The font proved to be to small.

##### New/ Current

![[Pasted image 20240225020801.png]]

![[Pasted image 20240225020905.png]]