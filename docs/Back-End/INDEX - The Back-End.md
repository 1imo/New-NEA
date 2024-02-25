
I remember when I used to think the back-end was some dark, mystic beast, a place of computer servers and machine code. It's a very strange emotion knowing that today, many web services are powered by APIs and the process easily abstracted so as to not remake the wheel, focusing on other things in the process.

Application Programming Interfaces are interfaces to data, data management and/ or functionality. They can be created in house or abstracted and a 3rd party tool may be used. Normally they are used in the form of Web APIs where specific functions are associated with specific URL paths on a web server or through packages of code which are imported into the local code base.

In this project, to date, there are 2 main separate Web APIs that process the data coming in from the client. One is the [[INDEX - Monolith API]] whilst the others act as [[INDEX - Micro-service Web APIs]]; taking a load off the main process, freeing up vital hardware resources and enabling a better developer experience in the case that something breaks or further functionality needs to be added.

As per the diagram, a client connects to the back-end which consists of two separate entities: the image server and the monolith API which is the main interface between the user and the user's data found on the [[INDEX - Database]]. At the time of writing there is also a Recommendation API, however, I am likely to convert that into a module which will then be used on the main API.

Most connections are made through HTTP requests, however, for real-time updates and the sake of performance because polling would eat away at the server resources, the main API also implements an expensive, but less so, [[INDEX - Web Socket Server]] which establishes a TCP/IP connection with the client every time a client's cookies change or a hard reset occurs which forces to socket to change.

![[Pasted image 20240223024240.png]]


I have also imported, plus implemented, external libraries and frameworks using package managers like NPM for JavaScript and Cargo for Rust as well creating my own packages in Rust and compiling them into WebAssembly for scenarios where performance is a key objective and overhead introduced by Web APIs called for this as a solution. You can find [[INDEX - Dependencies]] here.



