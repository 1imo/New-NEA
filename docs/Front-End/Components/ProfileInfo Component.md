
### External Components Used

- [[Loading Component]]


The ProfileInfo Component was created to avoid over cluttering the [[PAGE - Profile]]. It is responsible for displaying the user's information of the profile they have visited. 


### On First Render

A query is sent that fetches the data from [[User Queries#getPublicInfo]] with a parameter which is the username fetched from the URL path.

![[Pasted image 20240225191442.png]]


### Functionality.

##### Follow & Following

Part of the [[Follows, Following & Friendships]] workflow, users can follow others by pressing the follow button. If they are not currently friends or following them, the [[User Mutations#followUnfollowUser]] will follow them and send a friend request, otherwise the current follow or friendship will be removed. After this has completed, the window will be refreshed to update the data.

```
await followUnfollow({
	variables: { id: Ctx.id, secretkey: Ctx.secretkey, username: d }
}).then(() => window.location.reload())
```


### UI

![[Pasted image 20240225191945.png]]