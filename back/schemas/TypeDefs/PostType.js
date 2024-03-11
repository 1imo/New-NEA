// Importing necessary types from the 'graphql' module
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
} = require('graphql')

// Importing AuthorType
const AuthorType = require('./AuthorType')

// Defining a new GraphQLObjectType called 'PostType'
const PostType = new GraphQLObjectType({
  name: 'Post', // Name of the object type
  fields: () => ({
    id: {type: GraphQLInt}, // 'id' field with type GraphQLInt
    content: {type: GraphQLString}, // 'content' field with type GraphQLString
    user: {type: AuthorType}, // 'user' field with type AuthorType
    photo: {type: GraphQLBoolean}, // 'photo' field with type GraphQLBoolean
    date: {type: GraphQLString}, // 'date' field with type GraphQLString
    views: {type: new GraphQLList(AuthorType)}, // 'views' field with type GraphQLList of AuthorType
    likes: {type: new GraphQLList(AuthorType)}, // 'likes' field with type GraphQLList of AuthorType
    avgRatio: {type: GraphQLFloat}, // 'avgRatio' field with type GraphQLFloat
    multiplier: {type: GraphQLFloat}, // 'multiplier' field with type GraphQLFloat
  }),
})

// Exporting the PostType
module.exports = PostType
