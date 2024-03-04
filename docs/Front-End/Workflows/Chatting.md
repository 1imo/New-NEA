
Users are people and people like to talk. They talk with one another for many different reasons such as to catch up, work reasons or in the aims of getting to know one another better. Each type requires different functionality such as the people chatting for work might need to share files with one another. The one's catching up might want to share recent moments from their life in the form of images and videos. The ones with dating on their mind might want to think about what to reply before letting the other know that they have seen their message so as to think about what kind of image they are portraying.

Messaging is a fast, real-time medium of communication that must allow for users to interact with one another no matter where they are.

Messaging, as a form of written and recorded communication should offer the benefits of storing the chat history such as pulling up time-stamps as well as text that won't strain the eyes.


### Next Steps

In order to improve load times, lazy loading could be implemented in order to minimise huge payloads of data in transfer when a chatroom is initially loaded. It would work by instead requesting all message id's belonging to a chatroom on initial load with each message being requested when 10 below viewing it in the viewport. This would be especially useful for minimizing the load on the image server and minimizing calls to Azure for files stored as blobs. Each SMS, on average, is around 90 characters in length. Instead of transferring 90 bytes at a time (ASCII chars are 7 bits with a reserved bit of one), making initial loads sluggish, transferring just the ID's would be better but it would task the server with more requests which whilst the db is also in the cloud. maybe the chatroom should be stored in memory in a hashmap so that the message time would be log(1) or log(n) in the worst cases if there are many messages. Yes I think that is what I will do.