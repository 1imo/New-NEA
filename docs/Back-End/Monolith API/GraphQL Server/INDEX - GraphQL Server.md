GraphQL is a query language and runtime for APIs that empowers clients to request only the data they need, allowing for more efficient and flexible data fetching. Unlike traditional REST APIs where clients are limited to predefined endpoints and responses, GraphQL enables clients to specify exactly what data they require using a single query. This eliminates over-fetching and under-fetching of data, leading to reduced network traffic and faster response times. With GraphQL, clients can traverse the graph-like data structure and request nested fields, enabling them to retrieve complex data structures in a single request. Additionally, GraphQL provides a strong type system that allows API developers to define clear schemas with typed queries and mutations, ensuring data consistency and reliability.

To make use of this powerful tool, I chose to use it with Apollo Server to help structure the API, it's data through the use of type-checking on incoming and outgoing requests as well as the ability to create custom abstract data types.

Apollo Server, and GQL in general works by accepting queries as a string at one single endpoint, usually /graphql however, due to [[INDEX - Security]] that should change. Queries are of two types: queries (typically what you would see as a HTTP GET request) and mutations (a HTTP POST request). You can request what data you would like, set required fiends on both the client- and server-side. Caching is also remarkably easy to setup alongside React - Apollo even has an option to check the cache first before sending a request to the API which is great for things like the [[Nav Component]]. 


### Global Parameters

Since the API is rather largs with many routes for a plethora of things, it has been split up across files to allow for growing room, easier development and a better experience overall. To still follow DRY we have a few global variables that we will need in more than one route and upon the instantiation of the server, these are passed in as parameters to it's context so that they may be accessed in resolvers throughout.

```plaintext
// Mount the GraphQL endpoint at '/graphql' using graphqlHTTP middleware
app.use(
    '/graphql',
    // Configure graphqlHTTP middleware with the provided schema and options
    graphqlHTTP({
        schema, // The GraphQL schema defining the API's types and operations
        context: { // Provide context to resolvers for accessing external dependencies
            io, // Socket.IO instance for real-time communication
            prisma, // Prisma client for database interactions
            auth, // Function for user authentication
            sanitise, // Function for input sanitization
            log, // Function for logging errors
        },
    })
)
```



### Schema

The schema consists of a combination of queries: [[User Queries]] [[Post Queries]] [[Chatroom Queries]] and mutations: [[User Mutations]] [[Post Mutations]] [[Chatroom Mutations]]. Routes are accessible by query the route name in a GQL query.


### Type Definitions

GQL allows us to create our own abstract data structures made of other data types, primitive, composite or other abstract types.

[[User Type]] - All user data except sensitive info
[[SensitiveUserData Type]] - Sensitive user data
[[Profile Type]] - Profile Info (slightly breaks the rules)
[[Post Type]] - Post data
[[Author Type]] - Author of [[Post Type]] [[Message Type]]
[[Pending Type]] - Data about pending friendships aka a follow
[[Message Type]] - A message
[[Link Type]] - A redirect or a known null return
[[Chatroom Type]] - A chatroom

Please see [[INDEX - Models]] for use, storage and implementation of the data in the database layer. The above are a means of storage and organisation between the database and the client.


