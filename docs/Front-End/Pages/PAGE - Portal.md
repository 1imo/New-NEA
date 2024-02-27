
__Path__: /portal
__Intention__: Gives users options to sign up and sign in

Users are given the option to sign in with the [[Auth System]] through Google SignIn with Oauth, however, right now it isn't exactly secure due to the transmission of credentials through URL addresses which is why the button has been disabled temporarily. Users can also [[#sign in]] with their platform credentials and [[#sign up.]]

After making the [[DiscoverProfile Component]], I was inspired to make an [[#animation ]]for the portal too, however, instead of interfacing with the [[Circular Queue]] package I wrote in Rust, I opted to do the same in React so as to not link the page to anything that is hidden behind authentication [[INDEX - Front-End]].


### Analyse

To abstract complexity away from the sign in page, make it look less cluttered and provide a nicer first impression overall all, I think that sign up and sign in processes should be linked to from an initial `portal` page. This portal should accept input events from multiple device types, be accessible and this is the only part that can be indexed by search engines except for the posts. Therefore it should aim to be accessible to search engines in the future too with good links and content structure.


### Design

#### Links To

- [[PAGE - SignIn]]
- [[PAGE - Onboarding]]

![[Pasted image 20240225021339.png]]


#### On First Render

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


#### UI

##### Initial 

![[Pasted image 20240225020532.png]]

![[Pasted image 20240225020639.png]]

![[Pasted image 20240225020737.png]]

The font proved to be to small.

##### New/ Current

![[Pasted image 20240225020801.png]]

![[Pasted image 20240225020905.png]]


### Tests

#### Test Case 1: Rendering and Display

**Procedure:**
1. Render the `Portal` component.
2. Observe the displayed content.

**Expected Result:**
- The component should render without crashing.
- The component should display a section containing sign-in options, a greeting message, and profile images.
- The profile images should be displayed in a carousel-like manner, transitioning smoothly.
- The sign-in options should include "Sign In with Google", "Sign In" button, and "Sign Up" link.
- The greeting message should include a welcoming heading, a subheading, and a smiling emoticon.

#### Test Case 2: Sign In with Google Option

**Procedure:**
1. Render the `Portal` component.
2. Click on the "Sign In with Google" button.

**Expected Result:**
- Upon clicking the "Sign In with Google" button, the user should be redirected to the Google authentication page.

#### Test Case 3: Sign In Button

**Procedure:**
1. Render the `Portal` component.
2. Click on the "Sign In" button.

**Expected Result:**
- Upon clicking the "Sign In" button, the user should be redirected to the sign-in page.

#### Test Case 4: Sign Up Link

**Procedure:**
1. Render the `Portal` component.
2. Click on the "Sign Up" link.

**Expected Result:**
- Upon clicking the "Sign Up" link, the user should be redirected to the sign-up page.