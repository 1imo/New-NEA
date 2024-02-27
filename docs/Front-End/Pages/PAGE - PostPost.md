
__Path__: /post
__Intention__: Interface for a user to create, and post, a post


User can create a message and submit an image for use in the post. The UI should be quite simple to navigate and self-explanatory. Can be improved with sanitation, forgot to do that here but [[INDEX - Security#Data Validation & Sanitation]] covers that on the API side for now. Mime checking as well as actual file analysis would be great to implement here and on the [[Image Server]] too.


### External Components Used

- [[Nav Component]] (no icons)


### Analysis

Because this is a social network platform, a place where users share information in the form of posts among each other, they must be given a UI which accepts input from them no matter their device, which is clean, simple and easy to understand and use.

#### Adding Photos

By clicking the image upload SVG, a hidden input of file is programatically clicked so as to bring up the File Browser API. After selection it is then displayed to the user for feedback and stored in state to be used if the user decides to [[#post]].

The user, for now, is not made aware of the selection of their media and video uploads have not been tested. Content length is 100 chars max for now [[INDEX - Security]].

```
Define an image element:
    Set cursor style to pointer.
    Set image source to "/image.svg".
    Add onTouchEnd and onClick event listeners to call addPhoto function.
    
Define a hidden file input:
    Set onChange event listener to call addedPhoto function.
    Set class name to "fileInput".
    Set display style to "none".
    Set file type to accept only images.

Define addPhoto function:
    Find the file input element with class name "fileInput".
    Click the file input element.

Define addedPhoto function:
    Get the selected file and create a URL for it.
    Set the photo state with the created URL.

Initialize photo state variable and setPhoto function using useState, initially set to null.
```


#### Post

The post function handles the process of creating a post, including attaching and uploading an image if available.

```
Define an asynchronous function named post:
    Send a request to create a new post using the createPost mutation:
        Pass the user ID and secret key from the context.
        Include the post content from the postRef.
        Determine whether a photo is attached based on the value of the photo state.

    Upon receiving a response:
        If the post creation was successful and a photo is attached:
            Fetch the image from the photo URL.
            Convert the image data to a Blob object.
            Read the Blob as an array buffer using FileReader.
            Upon loading the array buffer:
                Convert it to a Uint8Array.
                Send a POST request to upload the image:
                    Include the post ID, image data, and correlation type in the request body.
        
        If a post URL is provided in the response data:
            Navigate to the provided URL.

        If an error occurs during the post creation:
            Log the error.
```

![[Pasted image 20240225023429.png]]


### UI

![[Pasted image 20240225024011.png]]
![[Pasted image 20240225024022.png]]


### Test

#### Test Case 1: Post Content Successfully

**Procedure:**
1. Render the `PostPost` component.
2. Enter valid post content into the input field.
3. Simulate posting the content by clicking the send button.

**Expected Result:**
- The post should be successfully created with the entered content.
- If no errors occur during the posting process, the user should be navigated to the post view page.
- The post should contain the entered content.

#### Test Case 2: Upload Photo with Post

**Procedure:**
1. Render the `PostPost` component.
2. Select a valid image file using the file input.
3. Enter valid post content into the input field.
4. Simulate posting the content by clicking the send button.

**Expected Result:**
- The post should be successfully created with the entered content and uploaded photo.
- If no errors occur during the posting process, the user should be navigated to the post view page.
- The post should contain the entered content and the uploaded photo.

#### Test Case 3: Display Loading Indicator

**Procedure:**
1. Render the `PostPost` component.
2. Enter valid post content into the input field.
3. Simulate the loading state while posting.

**Expected Result:**
- While the post is being created, a loading indicator should be displayed to indicate that the action is in progress.
- Users should be informed that the post is being processed.

#### Test Case 4: Handle Error Posting

**Procedure:**
1. Render the `PostPost` component.
2. Enter valid post content into the input field.
3. Simulate an error while posting the content.

**Expected Result:**
- If an error occurs during the posting process, an alert message should be displayed to notify the user about the error.
- The user should be able to retry posting or take appropriate action based on the error message.
