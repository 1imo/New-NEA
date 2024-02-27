
__Path__: /onboarding
__Intention__: Guide users through creating a new account

### External Components Used

- [[Loading Component]]
- [[Slider Component]]

![[Pasted image 20240225004310.png]]


### Analyse

To be able to collect user information, necessary to sign them up for the platform, there needs to be an onboarding process which requests multiple inputs seamlessly without interruption whilst also keeping the user entertained.

#### Routing

To make it easier for the user I decided to make a router for the user to interface between different [[Input Component]]s so that they only need to focus on one thing at a time. They also get to have fun playing with the [[Slider Component]].

The routing works by passing a state to the child [[Input Component]] and on completion, a switch statement checks that the value isn't null (it shouldn't be due to sanitation) and proceeds to change to the next screen. On completion it calls the [[#call()]] to create a user.

```
Define a useEffect hook with dependencies fn, ln, username, pass, and profile:

    Switch on the value change of the position variable:
        Case 0:
            Check if the fn variable is not an empty string:
                If true, set the position to 1
                Break out of the switch statement
        Case 1:
            Check if the ln variable is not an empty string:
                If true, set the position to 2
                Break out of the switch statement
        Case 2:
            Check if the username variable is not an empty string:
                If true, set the position to 3
                Break out of the switch statement
        Case 3:
            Check if the pass variable is not an empty string:
                If true, set the position to 4
                Break out of the switch statement
        Case 4:
            Check if the profile variable is not an empty string:
                If true, call the call function
                Break out of the switch statement

Define an array named screens containing JSX elements:
    Each element corresponds to a screen in the onboarding process
    The value of each element is an Input component with specific properties based on the current screen

Render the current screen based on the position variable:
    If load is false, render the screen at the index position from the screens array
```

![[Pasted image 20240225004049.png]]


#### call()

The call function handles the call to the [[User Mutations#createUser]]. On successful response it creates the needed cookies to store the API key and the User ID. On successful response, if a user uploaded a profile picture, that will be uploaded to the [[Image Server]], then finally the user will be redirected to the [[PAGE - Home]].

```
Define an asynchronous function named call:

    Set loading to true to indicate that the operation is in progress

    Perform an API call to create a new user:
        Use the createUser mutation with variables:
            - firstName: value of fn variable
            - lastName: value of ln variable
            - username: value of username variable
            - password: value of pass variable

    Check if the API call is successful:
        If successful:
            Extract the secretkey and id from the response data
            Set cookies for secretkey and id with an expiration of 7 days

            If the profile is provided:
                Perform an API call to upload the profile image:
                    Use the fetch function with the imageServer URL + "/upload" endpoint, method POST, and JSON body containing:
                        - id: user id from the response
                        - image: profile image
                        - correlation: "Profile"

            Navigate to the home page ("/")
```

![[Pasted image 20240225010947.png]]


#### UI

![[Pasted image 20240225014004.png]]

![[Pasted image 20240225014113.png]]

![[Pasted image 20240225014140.png]]
![[Pasted image 20240225014152.png]]
![[Pasted image 20240225014204.png]]

I am aware that the profile image upload interface is not user friendly, however, for now it will ship like that.


### Tests

#### Test Case 1: Rendering and Display

**Procedure:**
1. Render the `Onboarding` component.
2. Observe the displayed content.

**Expected Result:**
- The component should render without crashing.
- The component should display a series of input screens for user onboarding.
- Each input screen should prompt the user for specific information such as first name, last name, username, password, and profile picture.

#### Test Case 2: Providing First Name

**Procedure:**
1. Render the `Onboarding` component.
2. Provide a valid first name.
3. Proceed to the next input screen.

**Expected Result:**
- Upon providing a valid first name and proceeding, the component should transition to the next input screen for the last name.

#### Test Case 3: Providing Last Name

**Procedure:**
1. Render the `Onboarding` component.
2. Provide a valid last name.
3. Proceed to the next input screen.

**Expected Result:**
- Upon providing a valid last name and proceeding, the component should transition to the next input screen for the username.

#### Test Case 4: Providing Username

**Procedure:**
1. Render the `Onboarding` component.
2. Provide a valid username.
3. Proceed to the next input screen.

**Expected Result:**
- Upon providing a valid username and proceeding, the component should transition to the next input screen for the password.

#### Test Case 5: Providing Password

**Procedure:**
1. Render the `Onboarding` component.
2. Provide a valid password.
3. Proceed to the next input screen.

**Expected Result:**
- A password entry box is shown instead of a standard text input.
- Upon providing a valid password and proceeding, the component should transition to the next input screen for uploading a profile picture.

#### Test Case 6: Uploading Profile Picture

**Procedure:**
1. Render the `Onboarding` component.
2. Upload a valid profile picture.
3. Complete the onboarding process.

**Expected Result:**
- Upon uploading a valid profile picture and completing the onboarding process, the component should create a user profile with the provided information.
- The user should be redirected to the home page (/).
