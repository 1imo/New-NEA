
To provide persistent storage for the platform's needs I decided to implement PostgreSQL for it's reliability, maturity in the industry and the complex querying features it proves.

Firstly, PostgreSQL's relational model provides a robust framework for organizing and managing complex data relationships inherent in social media platforms. In a context where users interact with posts, comments, likes, and other entities, a relational database can efficiently handle these interconnected data structures.

Moreover, PostgreSQL's ACID compliance ensures data integrity, which is crucial for storing and retrieving user-generated content and interactions reliably. Features such as foreign key constraints and data validation capabilities further contribute to maintaining data integrity, ensuring the accuracy and consistency of the database.

Scalability is another key consideration for social media applications, and PostgreSQL excels in this regard. Its ability to handle growing volumes of data and user activity makes it well-suited for platforms experiencing rapid expansion and engagement levels.

Performance is paramount in social media environments, where responsiveness and efficiency are critical. PostgreSQL's reputation for robust performance, especially when optimized and configured appropriately, makes it a compelling choice for handling large volumes of data and complex queries efficiently.

Security is also paramount, given the sensitivity of user data in social media applications. PostgreSQL offers robust security features such as role-based access control, SSL encryption, and support for various authentication mechanisms, ensuring the protection of user privacy and preventing unauthorized access to sensitive information.

Overall, by considering factors such as relational model, ACID compliance, scalability, community support, performance, and security, PostgreSQL is well-suited for a social media database, providing the necessary foundation for reliability, scalability, and data integrity.


### Interacting with PostgreSQL

Integrating Prisma with PostgreSQL offers several advantages. Firstly, Prisma simplifies the process of interacting with databases by providing a type-safe and intuitive ORM (Object-Relational Mapping) layer. This abstraction allows developers to work with databases using familiar programming constructs, such as classes and methods, rather than dealing directly with SQL queries. This can significantly reduce development time and complexity, especially for complex data models common in social media applications.

Furthermore, Prisma offers powerful query capabilities, including support for complex filtering, pagination, and aggregation, which are essential for retrieving and manipulating data in social media APIs. These query features enable developers to build efficient and optimized database interactions without having to write complex SQL statements manually.

Another advantage of using Prisma with PostgreSQL is its support for database migrations. Prisma's migration tool allows developers to manage database schema changes seamlessly, including creating, modifying, and rolling back migrations. This simplifies the process of evolving the database schema over time as the requirements of the social media application evolve.

Additionally, Prisma provides a robust and scalable foundation for building [[INDEX - GraphQL Server]], which are becoming increasingly popular for developing modern web applications, including social media platforms. Prisma's integration with GraphQL makes it easy to expose database queries and mutations as GraphQL endpoints, enabling clients to fetch and manipulate data efficiently.

Overall, by combining Prisma with PostgreSQL, developers can benefit from a streamlined development experience, powerful query capabilities, seamless database migrations, and support for GraphQL APIs, making it an excellent choice for building scalable and efficient social media APIs.


### Security

For security purposes the database, for now, is ran locally alongside the API and the information to connect to it is stored in a [[env]] file so as to not accidentally expose the information whilst using version control.


### High-level Overview

![[Pasted image 20240224155747.png]]

![[Pasted image 20240224155807.png]]