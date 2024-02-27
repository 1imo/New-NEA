
__Path__: /sign_in
__Intention__: A graphical interface facilitating a user in their sign in to the platform


### External Components Used

- [[Input Component]]
- [[Loading Component]]


### Analysis

The user must be given an interface to enter the site credentials which are then sent off and verified. The sign in must be accessible and easy to navigate whilst at the same time maintaining responsiveness.


### Design

#### Routing

Like the [[PAGE - Onboarding]], the [[Auth System]] employs the power of a component router to make use of the reusable, multi-scenario [[Input Component]]. By switching a view, then returning the value for the username, only to then do it once again for the password now with a password protected field and then to call the [[User Mutations#signIn]] API resolver.

```
Define a function signIn using useMutation hook with SIGN_IN mutation
    - Destructure the signIn function and its response object containing data, loading, and error states
    - If loading state is true, return a loading component
    - If error state is true, display an alert for sign-in error

Define an asynchronous function named call:
    - Await the signIn function with provided username and password variables
    - If the response contains secret key and user ID:
        - Set cookies for the secret key and user ID with a 7-day expiration
        - Navigate to the home page

Use the useEffect hook to handle changes in username and password:
    - Switch based on the position state:
        - If position is 0 and a username is provided:
            - Update the position state to 1
        - If position is 1 and a password is provided:
            - Set the loading state to true
            - Call the call function to sign in

Define an array named screens to hold the input screens for the sign-in process
Render the appropriate screen based on the current position state and loading state
```

![[Pasted image 20240225064955.png]]

Whilst the API call is in process, the [[Loading Component]] is returned so as to give feedback to the user and an alert is shown in case of an error.

```
if(loading) return <Loading />
if(error) alert("Error Signing In")
```

#### UI

![[Pasted image 20240225142420.png]]
![[Pasted image 20240225142433.png]]


### Tests

#### Test Case 1: Sign In Successfully with Valid Credentials

**Procedure:**
1. Render the `SignIn` component.
2. Provide valid username and password.
3. Pressing the Enter key to submit the form.

**Expected Result:**
- The component should send a sign-in mutation request with the provided credentials.
- Upon successful sign-in, the user should be redirected to the home page ("/").
- Cookies for the secret key and user ID should be set with an expiration of 7 days.

#### Test Case 2: Display Error Message if Sign In Fails

**Procedure:**
1. Render the `SignIn` component.
2. Provide invalid username and password to trigger an error response from the server.

**Expected Result:**
- The component should display an error message indicating the failure to sign in.
