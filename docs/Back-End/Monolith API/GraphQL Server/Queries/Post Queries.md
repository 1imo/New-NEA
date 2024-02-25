Since a social media is usually only as good as it's network of users, as an incentive to spur new users to join the site, I have decided to allow posts to be publicly viewable if on their own dedicated page. The page also serves as a nice area for screenshots.


### getPost

Returns a post of specified ID to user. They are of a numbered format so that people can maybe appear on a random one if the decide to play around with the URL paths.

![[Pasted image 20240223221629.png]]

```plaintext
Define getPost:
    Type: PostType
    Arguments:
        id:
            Type: Int
    Resolve asynchronously:
        Try:
            Sanitise args
            Fetch post from Prisma:
                Where id equals args.id
                Select id, content, photo, and user details
            Return post
        Catch error:
            Log error
            Return
```
