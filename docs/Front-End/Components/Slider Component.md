
__Used In__: [[Input Component]]


### Analysis

Data input is often done quickly and user's don't often think twice about what they are entering. Plain buttons are boring and aren't all that interactive. This is why I created a slider which brings interactivity to the UI, improving UX and it slows users down, preventing too many requests at once to the API plus it makes users more thoughtful about the process.


### Design

Since the slider is to be used across multiple devices including mobile and desktop. it must respond to triggers from all kinds of input events as well as maintaining responsiveness. 

![[Pasted image 20240225195048.png]]
![[Pasted image 20240225195119.png]]
![[Pasted image 20240225195137.png]]
![[Pasted image 20240225195156.png]]
![[Pasted image 20240225195221.png]]
![[Pasted image 20240225195242.png]]

#### UI

![[Pasted image 20240225195421.png]]

To improve the slider, for next steps colour interpolation could be implemented for a smoother, more gradual colour change which would improve the user experience.


### Tests

#### Test Case 1: Dragging Functionality

**Procedure:**
1. Render the Slider component.
2. Simulate dragging the slider to the right.
3. Release the slider.

**Expected Result:**
- The slider should move to the right as it's dragged.
- When released, if the slider has been dragged beyond a certain threshold (two-thirds of the available space), it should trigger the verification process.
- The verification process should reset the slider's position.

#### Test Case 2: Touch Events Handling

**Procedure:**
1. Render the Slider component.
2. Simulate touch events (touchstart, touchmove, touchend) to drag the slider.
3. Release the slider.

**Expected Result:**
- The slider should respond to touch events similarly to mouse events, moving accordingly.
- When released, if the slider has been dragged beyond a certain threshold, it should trigger the verification process.
- The verification process should reset the slider's position.

#### Test Case 3: Reset Functionality

**Procedure:**
1. Render the Slider component.
2. Trigger the verification process by setting the verify prop to true.
3. Observe the behavior of the slider.

**Expected Result:**
- The slider's position should reset to its initial state.
- The verification process should not be triggered again until the slider is dragged beyond the threshold.
