const {GraphQLObjectType, GraphQLString} = require('graphql')
const {graphqlHTTP} = require('express-graphql')

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    username: {type: GraphQLString},
  }),
})

module.exports = AuthorType
