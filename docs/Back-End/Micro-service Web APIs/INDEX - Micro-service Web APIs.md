
In support of the [[INDEX - Monolith API]], I have created extra Rust micro-services in places which would otherwise use a lot of processing power, take a lot longer if they were written in JavaScript and for general improvement on the creation of modules improving the potential for scalability in the future.

### Recommendation Server

[[Recommendation Server]] for people looking to discover new connections. Based on graph theory and analysis. Might be converted into a module if network overhead gets too high due to the transmission of large amounts of JSON.


### Image Server

[[Image Server]] for managing media on the platform. Includes support for upload and sharing but this could prove time-consuming to scale and could be replaced with a CDN in the future.