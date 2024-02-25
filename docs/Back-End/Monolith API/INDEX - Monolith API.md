
The monolith API is mainly made with JavaScript's runtime NodeJs. I picked this due to speed of development, the plethora of resources out there and the amount of developers out there in case the service needs to scale in the future.

In essence, it is a HTTP server ran on the ExpressJs Framework which further runs 2 more servers/ services on the port. I picked Express due to it's reliability - it's able to handle 15000 requests per second! It also has regular updates, great community support and it's great to implement.

GraphQL is a query language and a runtime for making APIs. It is a great alternative to REST and SOAP standards due it's efficiency. Redundant data isn't sent reducing network and performance overhead; there is only one endpoint which needs securing; the resultant code is easier to turn into modules, improving the readability of code and saving resources if something needs to be changed down the line.

With the help of Apollo as the [[INDEX - GraphQL Server]], one end point is made available for clients to interface with the the data.

This API is, by design, the only connection to the [[INDEX - Database]]. In case of the need for scale, this API will remain as the interface for the data whilst all other functionality will be ported to a new service that will link back to this one - GQL (GraphQL) coupled with the ORM Prisma, transform the way data is retrieved, handled and process.

To aide in the retrieval of data, data modelling and storage as well as overall developer experience, I chose to use Prisma ORM as my way of communicating with the PostgreSQL database. It has the ability for advanced queries using boolean logic, aggregate SQL functions, pagination and more. It is a beautiful way of data handling and much nicer overall to all other alternatives out there. Once again it is great for scalability because No-SQL database engineers will appreciate the way the way the data is queried, having only to learn relations and querying; and SQL engineers will need to just learn some new syntax. Here is an example of such code.

Requests to the server are made via HTTP requests. Whilst HTTP does return a response, it is not truly bidirectional and therefore is not suitable for applications that require real-time updates and polling would waste server resources. Instead I implemented a [[INDEX - Web Socket Server]] using Socket.IO. On the client's first session access to the client interface, a connection is established and the socket.id associated with the user ID allowing for future bidirectional communication.

Due to the API being public facing - meaning that it is available on the internet - it isn't unlikely for the service to be probed for vulnerabilities in it's software and design. Therefore [[INDEX - Security]] measures must be implemented in order to ward away attackers, mitigate redundant calls that would waste server resources and keep user data safe from the call of the dark web forums.



