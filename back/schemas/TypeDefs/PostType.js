const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
} = require('graphql')

const AuthorType = require('./AuthorType')

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {type: GraphQLInt},
    content: {type: GraphQLString},
    user: {type: AuthorType},
    photo: {type: GraphQLBoolean},
    date: {type: GraphQLString},
    views: {type: new GraphQLList(AuthorType)},
    likes: {type: new GraphQLList(AuthorType)},
    avgRatio: {type: GraphQLFloat},
    multiplier: {type: GraphQLFloat},
  }),
})

module.exports = PostType
