// Importing necessary types from the 'graphql' module
const {GraphQLObjectType, GraphQLSchema} = require('graphql')

// Importing Mutations
const UserMutations = require('./Mutations/UserMutations')
const PostMutations = require('./Mutations/PostMutations')
const ChatroomMutations = require('./Mutations/ChatroomMutations')

// Importing Queries
const PostQueries = require('./Queries/PostQueries')
const UserQueries = require('./Queries/UserQuery')
const ChatroomQueries = require('./Queries/ChatroomQueries')

// Defining the RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType', // Name of the RootQuery
  fields: {
    ...UserQueries, // Spreading UserQueries fields
    ...PostQueries, // Spreading PostQueries fields
    ...ChatroomQueries, // Spreading ChatroomQueries fields
  },
})

// Defining the Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation', // Name of the Mutation
  fields: {
    ...UserMutations, // Spreading UserMutations fields
    ...PostMutations, // Spreading PostMutations fields
    ...ChatroomMutations, // Spreading ChatroomMutations fields
  },
})

// Exporting the GraphQLSchema
module.exports = new GraphQLSchema({
  query: RootQuery, // Setting the RootQuery
  mutation: Mutation, // Setting the Mutation
})
