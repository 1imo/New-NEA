
API security is a must. Descriptive event logging, data sanitizing for multiple scenarios and updating software is a must to keep malicious users at bay.

Right now, since the platform is in beta and doesn't collect or store much of a user's data ([[Back-End/Database/Models/User Model]] [[UserData Model]] ), the data isn't extremely valuable yet although it is important to safeguard this information for the user and to follow GDPR guidelines of ensuring the security and confidentiality of said data.

### HTTP Headers

HTTP headers are fundamental components of HTTP requests and responses, providing metadata about the message being transmitted. When a client sends a request to an API, it includes various HTTP headers in the request, such as `Content-Type`, `Authorization`, and `Accept`, among others. These headers convey important information to the API server, such as the content type of the request payload, authentication credentials, and the expected response format.

![[Pasted image 20240223063445.png]]

One of the first defenses is CORS. Cross-Origin Resource Sharing is a standard for sharing resources between different origins. It is a security mechanism that functions primarily on the server and determines whether the client is of the right domain to access the API. This straight away prevents anyone but the client connecting to the API, but it isn't bulletproof; there are still attack vectors to handle.

```
Function handleRequest(request):
    If the request is cross-origin:
        If the request method is allowed:
            If the request origin is allowed:
                Set CORS headers to allow the request
                Process the request
            Else:
                Set CORS headers to deny the request
                Return a response with status code 403 (Forbidden) and a message indicating that the request is not allowed
        Else:
            Return a response with status code 405 (Method Not Allowed) and a message indicating that the request method is not allowed
    Else:
        Process the request normally

Function isCrossOriginRequest(request):
    Check if the request origin is different from the server's origin

Function isRequestMethodAllowed(request):
    Check if the request method is allowed (e.g., GET, POST, PUT, DELETE)

Function isRequestOriginAllowed(request):
    Check if the request origin is allowed

Function setCorsHeaders(request):
    Set CORS headers to allow the request from the specified origin

Function setCorsHeadersForDeniedRequest(request):
    Set CORS headers to deny the request from the specified origin

Function createResponse(statusCode, message):
    Create a response with the specified status code and message

// Example configuration
serverOrigin = "https://example.com"
allowedOrigins = ["https://example.com", "https://subdomain.example.com"]
allowedMethods = ["GET", "POST", "PUT", "DELETE"]
allowedHeaders = ["Content-Type", "Authorization"]

// Example usage
request = {
    origin: "https://subdomain.example.com",
    method: "GET"
}

handleRequest(request)
```

Then there are more HTTP header policies which we can adjust to further filter out unnecessary requests which would affect the platform.

HTTP by default isn't encrypted and attackers sometimes leverage this through a MITM attack where they capture data whilst acting as a proxy between the API and the client. HTTPS prevents the reading of the data during transit and setting the HSTS (Strict-Transport-Security) prevents an attacker downgrading connections to HTTP. Currently it isn't implemented due to it causing issues in a development environment.

```
Function setStrictTransportSecurityHeader():
    // Setting HSTS to the strictest settings ensures HTTPS communication
    Header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

The X-DNS-Prefetch-Control header doesn't really introduce any security issues on a standalone API but in the name of a potential minuscule performance boost, we'll disable it.

```
Function setDNSPrefetchControlHeader():
    // Disabling DNS prefetching helps prevent DNS-related attacks
    Header: X-DNS-Prefetch-Control: off
```

HTTPS requires certificates in order to function. These certificates can sometimes be forged or malformed and in order to mitigate against certificate spoofing, we must declare certificate checks with Expect-CT Header.

```
Function setExpectCTHeader():
    // Enabling Expect-CT requires certificate logging in CT logs
    Header: Expect-CT: enforce, max-age=86400
```

At this current stage, the API doesn't serve HTML, nor is it likely to but even if at some point it is served in a frame, we will have successfully deterred a bad request by denying the X-Frame-Options header as that is not what the system is designed to do/ accommodate.

```
Function setXFrameOptionsHeader():
    // Setting X-Frame-Options to "DENY" prevents clickjacking attacks
    Header: X-Frame-Options: DENY
```

Enabling X-Content-Type-Options with the "nosniff" directive is a recommended security practice for APIs, as it helps to reduce the risk of XSS attacks without adversely affecting functionality.

```
Function setXContentTypeOptionsHeader():
    // Setting X-Content-Type-Options to "nosniff" prevents MIME-sniffing attacks
    Header: X-Content-Type-Options: nosniff
```

Disabling X-Permitted-Cross-Domain-Policies as that is just a standard thing in the scenario where we do not need to make use of plugins like Adobe Flash

```
Function setXPermittedCrossDomainPoliciesHeader():
    // Setting X-Permitted-Cross-Domain-Policies to "none" restricts cross-domain access for plugins
    Header: X-Permitted-Cross-Domain-Policies: none
```

The final header which we will be setting is the Referrer-Policy which will reduce some potentially sensitive tracking information being sent via HTTP, improving user privacy and security alongside gaining another minuscule performance gain.

```
Function setReferrerPolicyHeader():
    // Setting Referrer-Policy to "same-origin" restricts referrer information leakage
    Header: Referrer-Policy: same-origin
```


### Auth System

Most of the requests to this API require a user to be authenticated as the information is usually user-specific/ centred. It ensures only authorized users can access the data and prevent waste of resources on those who are not.

To achieve this, users are issued with an apikey generated with [[nanoid]] on sign in or sign up. This is changed every week per the cookie-expiry date on the cookie. This of course can be circumvented by changing the date in the developer tools but we are aware of that and implementing other functionality too. The API key changes every time a user logs in which means only one session per account, and on every password reset request.

The API key, together with their user ID is used to authenticate them.

I have just thought that I could set an expiry time server-side on each API key by storing it next to them and if a user Auth's in and the key is due to expire within the next day say, we would change it to maintain a securer persistent login in for the eternity of the runtime of the service. I will implement this after the initial write up.

![[Pasted image 20240223181758.png]]

```
Function auth(id, key):
    // Asynchronously check if user data exists in the database
    exists = await prisma.userData.count({
        where: {
            AND: [{id: id}, {secretkey: key}],
        },
    })

    // If user data doesn't exist, throw an error indicating invalid credentials
    If exists is false:
        Throw an Error with message 'Invalid Credentials'
    Else:
        // If user data exists, return true
        Return true
```

As per recommendations, the secretkey (apikey) and password are stored in a separate table to normal user data [[UserData Model]] [[Back-End/Database/Models/User Model]]. 


### Logging

Analysis is a major part of security. Without any information as to what is going on to, it would be very hard to see that there is a problem sometimes, let alone fix it. Therefore, I have created a simple logging system that stores errors in a text file named after the date, alongside the time the error had occurred. Errors are typed out whilst purposely throwing new Errors and it would be great to implement a naming convention/ system for them but due to the nature of DRY code, it isn't really necessary. Errors can range from "Invalid Credentials" to "Service Down" which refers to a micro-service written in Rust.

```plaintext
Function log(e):
    // Get the current timestamp
    timestamp = Date.now()

    // Create a Date object using the timestamp
    currentDate = new Date(timestamp)

	day = currentDate.day()
	time = currentDate.time()

    // Format the date and time
    formattedDate = currentDate.toLocaleString('en-US', day)
    formattedTime = currentDate.toLocaleString('en-US', time)

    // Append the error message to the log file
    fs.appendFileSync(
        `/logs/${formattedDate}.txt`,
        `${formattedTime}    ${e.message}`,
    )
```


### Data Validation & Sanitation

Data is the forefront of the platform. Everything runs on data, everything relies on data. Data is also the weakest point of our application. When who knows who can do as they please, you can be sure there will be one bad nut somewhere. 

Proper sanitation and validation helps prevent security vulnerabilities such as SQL injection, XSS and command injection as well as maintaining data integrity plus reliability and following legislation like GDPR.

In order to improve performance, similar checks are done on input fields on the client side too. See [[Input Component]].

```plaintext
Function sanitise(input):
    // Create an empty object to store sanitized data
    sanitizedObj = {}

    // Iterate over each key-value pair in the input object
    For each key in input:
        // Get the value associated with the current key
        value = input[key]

        // Initialize sanitizedValue with the original value
        sanitizedValue = value

        // Escape Characters: Replace special characters with their escaped counterparts
        sanitizedValue = Replace special characters in sanitizedValue

        // Blacklisting: Remove blacklisted characters from the value
        For each blacklisted character in blacklistedChars:
            sanitizedValue = Remove blacklisted character from sanitizedValue

        // Length Limitation: Ensure the value does not exceed the maximum length
        maxLength = 100 // Example maximum length
        sanitizedValue = Truncate sanitizedValue to maxLength characters

        // Canonicalization: Remove leading and trailing spaces
        sanitizedValue = Remove leading and trailing spaces from sanitizedValue

        // Assign the sanitized value to the corresponding key in the sanitized object
        sanitizedObj[key] = sanitizedValue

    // Return the sanitized object
    Return sanitizedObj
```

This method of functional sanitation + validation allows for dynamic object checking meaning it fits every use case scenario and is easy to implement as it is exported across the API globally.


### GraphQL API

By default the GraphQL runtime checks if the body of the request follows the outlined arguments we have declared for a specific route. When creating resolvers you can specific whether a field is optional and what Datatype is should be as well as creating your own. This further filter requests.



