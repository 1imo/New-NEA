
Globally available variables and functions.

![[Pasted image 20240225195931.png]]

##### ID
User ID, stored in Cookies, retrieved for faster retrieval

##### SecretKey
User's API Key for [[INDEX - Monolith API]], also stored and retrieved from cookies

##### ImageServer
Address to reach the [[Image Server]]. Declared here in case it changes.

##### Socket
Initialized socket here so that it doesn't update on individual component re-renders and the connection stays persistent throughout the session with [[INDEX - Web Socket Server]].

##### msgStore
This was a part of a `chewing gum` solution. Looking back I would have used React Refs to references to reference data I would like to be persistent between re-renders.