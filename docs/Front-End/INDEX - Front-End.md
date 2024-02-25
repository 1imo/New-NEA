
The front-end is the interface between the client and the functionality. It must be easy to navigate, dynamic and fast. The correct data must be displayed when requested and it should be accessible to all users.

This is why I decided to go with ReactJS. React is an open-source JavaScript library developed by Facebook for building user interfaces, particularly for single-page applications where UI updates are frequent. It allows developers to create reusable UI components and manage the state of these components efficiently.

### Routing

In the context of routing - the traversal of URL paths to access different locations and therefore receive different output, there are 2 main differentiators for this system: [[#Public]] and [[#Private]]. 

Public paths are accessible with and without a user path. They are there to facilitate authentication to the site and the sharing of data. They do not contain sensitive information, nor do they allow the mutation of existing data.

Private paths that require a login is the system itself, a user can do anything they wish as there privileges allow. If an unauthenticated user attempts to access the private paths, they will be redirected towards the [[#Portal]]. Authentication status is managed in [[INDEX - Context]]

![[Pasted image 20240224191434.png]]

#### Public

##### Onboarding
__Page__: [[PAGE - Onboarding]]
__Route__: /onboarding
__Functionality__: Account creation for users

##### Portal
__Page__: [[PAGE - Portal]]
__Route__: /portal
__Functionality__: Gives the user options to sign up and sign in

##### 404
__Page__: [[PAGE - 404]]
__Route__: /404
__Functionality__: Error page/ page not found

##### PostView
__Page__: [[PAGE - PostView]]
__Route__: /post/id/{:id}
__Functionality__: Views a posted post

##### SignIn
__Page__: [[PAGE - SignIn]]
__Route__: /sign_in
__Functionality__: Sign in with platform credentials


#### Private

##### Home
__Page__: [[PAGE - Home]]
__Route__: /
__Functionality__: Home page, mainly to display feed

##### MessageList
__Page__: [[PAGE - MessageList]]
__Route__: /messaging
__Functionality__: Displays all chatrooms the user is a part of

##### MessageToPerson
__Page__: [[PAGE - MessageToPerson]]
__Route__: /messaging/id/{:id}
__Functionality__: Displays the chatroom of parameter id

##### PostPost
__Page__: [[PAGE - PostPost]]
__Route__: /post
__Functionality__: User can create and post a post

##### Profile
__Page__: [[Profile Type]]
__Route__: /profile/{:id}
__Functionality__: View the profile of a user

##### Search
__Page__: [[PAGE - Search]]
__Route__: /search
__Functionality__: Multiple use-case search

##### Settings
__Page__: [[PAGE - Settings]]
__Route__: /settings
__Functionality__: Change user info and validate friend requests


