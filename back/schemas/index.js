const {GraphQLObjectType, GraphQLSchema} = require('graphql')

const UserMutations = require('./Mutations/UserMutations')
const PostMutations = require('./Mutations/PostMutations')
const ChatroomMutations = require('./Mutations/ChatroomMutations')

const PostQueries = require('./Queries/PostQueries')
const UserQueries = require('./Queries/UserQuery')
const ChatroomQueries = require('./Queries/ChatroomQueries')
const AuthQueries = require('./Queries/AuthQueries')

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...AuthQueries,
    ...UserQueries,
    ...PostQueries,
    ...ChatroomQueries,
  },
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...UserMutations,
    ...PostMutations,
    ...ChatroomMutations,
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
