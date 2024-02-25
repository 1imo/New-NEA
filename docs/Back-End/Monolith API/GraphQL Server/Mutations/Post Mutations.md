
Requests to the API for the change of stored data relating to the [[Post Model]].


### createPost

Request to create a post on the network by a user. After creation, user is redirected to the dedicated page of the post in question.

Returns: [[Link Type]]

```plaintext
Define createPost:
    Type: LinkType
    Arguments:
        id:
            Type: String
        secretkey:
            Type: String
        content:
            Type: String
        photo:
            Type: Boolean
    Resolve asynchronously:
        Sanitise args
        Try:
            Authenticate user using provided id and secretkey
            Create a new post in Prisma:
                Set content to args.content
                Set userId to args.id
                Set photo to args.photo
            Return the URL of the created post and its ID
        Catch error:
            Log error
            Return
```


### postViewed 

Hit when a post is in the viewport of a user. It will affect the [[Database/Models/User Model|User Model#avgRatio]] by recalculating the like to view count ratio of said post affecting it's future rankings in peoples' feeds.

Returns: [[Link Type]]


### postLiked

Triggered when a user double taps the post component. It also affects the [[Database/Models/User Model|User Model#avgRatio]] by recalculating the view count ratio.

Returns: [[Link Type]]
