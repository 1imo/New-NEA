
Component designed to render the a Post in the viewport.


### Props

![[Pasted image 20240225175237.png]]


### Functionality

##### Dedicated Page View

By tapping on the post, the user will be taken to the [[PAGE - PostView]]

```
onClick={() => navigate(`/post/id/${props?.data?.id}`)}
```

##### Like

By double tapping the post component, the User will leave a like on the post. Right now the user receives no feedback and as per the [[Mission]], no like counter is shown. [[Post Mutations#postLiked]]

```
Async function like():
    Set liking state to true to indicate that the like operation is in progress
    Execute postLiked mutation to indicate that the user has liked the post:
        - Pass variables (id, secretkey, post) to the mutation representing user ID, secret key, and post ID respectively
        - Await the response from the mutation

    If response exists:
        Set liking state to false to indicate that the like operation is complete
```


##### View

When the post is in the observable viewport, it is recorded and the post's stored information is stored accordingly. [[Post Mutations#postViewed]]

```
await postViewed({variables: { post, secretkey, id }})
```


##### Viewing Media

In the props, if a boolean flag of true is passed with the photo key, the [[Image Server]] is then queried for the corresponding media and attatched.

```
<div style={{backgroundImage: `url(${Ctx.imageServer}/fetch/post/${props?.data?.id})`, backgroundSize: "cover", aspectRatio: "1/1", height: "100% !important", marginTop: 8, borderRadius: 8, display: !props?.data?.photo ? "none" : null}}>&nbsp;</div>
```


### UI

![[Pasted image 20240225190130.png]]