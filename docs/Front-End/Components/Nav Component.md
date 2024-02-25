
The Nav is the main way of navigating through the platform. Without it navigation is rather hard and I accept on some pages I do need to include back buttons as it gets rather tiring editing URL paths when the Nav isn't available.

The Nav gives user's a limited set of options so that they do not get confused as to how they should use the component.


### External Components Used

- [[Loading Component]]


### Props

![[Pasted image 20240225172523.png]]


### Links

Component links towards the user's own [[PAGE - Profile]], [[PAGE - PostPost]], [[PAGE - Search]], [[PAGE - MessageList]], [[PAGE - Settings]].

![[Pasted image 20240225174151.png]]


### Data Fetching

Data needs to be fetched from [[User Queries#navInfo]], or from local storage to populate the Nav with the user's name and username, also allowing us to fetch their profile picture if they have one. Whilst loading, the [[Loading Component]] is shown and the user is made aware if an error has occurred whilst fetching their data.


### UI

![[Pasted image 20240225174044.png]]
