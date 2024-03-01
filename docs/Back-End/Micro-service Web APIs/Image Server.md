
To secure the [[INDEX - Monolith API]], I offloaded media functionality to a smaller service which I made in Rust for it's speed. It's a simple API which allows for uploading and storing files and then makes them publicly available through an endpoint with a HTTP GET request.


### Analysis

Images are a core part of communication especially through digital means such as social media. I recognise that images will be used a lot in production and if the current method of cold storage through directories cannot cope with the load, a better means of storing and serving images would be through the use of a hashmap. A hashmap is a key value store which works on the hashing of the value, creating a key based on the hash value and moduloing the value. If there is an item already there, it'll create a linked list with all the values. This creates an algorithm with a time complexity of log(1) and in the worst-case scenario log(n). This is more efficient than retrieval of files from directories and further conversion from files into arrays of bits and offer caching mechanisms for retrieval of frequently fetched images. In development, however, I am constantly turning of the image API and for now I do not want to permanently host this API in fear of large data retrieval charges from cloud providers. This is why I will stick with this means of data sharing for the time being.


##### Upload Type

Upload type is defined in the [[#Payload]] of the request to upload.

![[Pasted image 20240224123923.png]]

```
#[derive(Debug, Deserialize)]

enum UploadType {

	Profile,

	Post

}
```


#### Payload

Body of a request to store media on the API.

ID: User or Post ID

Image: Unsigned array of 8 bit integers (converted Image from client: [[Post Mutations#createPost]] [[User Mutations#createUser]])

Correlation: [[#Upload Type]]

![[Pasted image 20240224140835.png]]

```
#[derive(Debug, Deserialize)]

struct Payload {

	id: String,

	image: String,

	correlation: UploadType

}
```


#### Request

The structure of the body of a request to fetch data from the API.

ID: User or Post ID

Correlation: [[#Upload Type]]

![[Pasted image 20240224140945.png]]

```
#[derive(Debug, Deserialize)]

struct Request {

	id: String,

	correlation: UploadType

}
```


### API Architecture

Two routes are available to facilitate [[#Uploading Media]] at /fetch with dynamic parameters and for GET requests and [[#Sending Media]] at /upload for POST requests. To improve security I could in the future create authentication methods or pivot towards using something different is the server doesn't fare in production such as a 3rd party content delivery network.

![[Pasted image 20240224132826.png]]

```plaintext
Define the main function as asynchronous:
    Create a new CorsLayer and allow it to use methods: GET, POST

    Create a new Router for the application
    Add a route "/upload" with the handler upload_image for POST requests
    Add a route "/fetch/:type_id/:id" with the handler send_image for GET requests
    Add the CorsLayer to the application

    Print "Running on URL ADDRESS

    Bind the server to address URL ADDRESS and serve the application
End of main function
```


### Uploading Media

For now I decided to focus on image upload alone. To make this better I could check mime types of files uploaded with my own, or external libraries. I could also sanitize the input.

Anyhow, a body of [[#Payload]] should be submitted otherwise the request will be rejected and dependent on the [[#Upload Type]] will be stored in either the Profile directory with all the user profile images, or the Post directory with all the other post media.

![[Pasted image 20240224131348.png]]

```plaintext
Define upload_image function:
    Parameters:
        payload: Json<Payload>
    Returns: String
    Resolve asynchronously:
        Extract image data from payload
        Convert image data to bytes vector:
            Split image data by comma
            Map each substring to u8 and collect into a vector
        Match payload correlation:
            If UploadType is Post:
                Construct file path as "post/{payload.id}.jpg"
                Create file at file path
                Write image bytes to file
                Return an empty string
            If UploadType is Profile:
                Construct file path as "profile/{payload.id}.jpg"
                Create file at file path
                Write image bytes to file
                Return an empty string
```


### Sending Media

Media is requested with a HTTP GET request to /fetch/ with parameters of type and id in the format "/fetch/:type_id/:id". Type refers to the [[#Upload Type]], as to how the media will be used, in what context, an post or profile. Then the id is the unique identifier correlating to the use case it refers to.

![[Pasted image 20240224131127.png]]

```plaintext
Define send_image function:
    Parameters:
        (type_id, id): Path<(String, String)>
    Returns: Response<Body>
    Resolve asynchronously:
        Initialize file_path as empty PathBuf
        Extract type_id as a string
        Match type_id:
            If "post":
                Append "post" to file_path
            If "profile":
                Append "profile" to file_path
            Otherwise:
                Return response with status BAD_REQUEST and message "Invalid image type"
        Append "{id}.jpg" to file_path
        If file_path does not exist:
            Return response with status NOT_FOUND
        Open file at file_path:
            If error occurs, panic with message "Error opening image file"
        Initialize buffer as empty vector
        Read image data into buffer:
            If error occurs, panic with message "Error reading image data"
        Return response with status OK and body containing buffer
```