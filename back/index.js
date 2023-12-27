const express = require("express")
const userData = require("./USER_DATA.json")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schemas/index.js")
const cors = require('cors')
const app = express()
app.use(cors())



app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))


  
app.listen(8000);