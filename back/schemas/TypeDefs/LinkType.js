const {GraphQLObjectType, GraphQLString} = require('graphql')

const LinkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    url: {type: GraphQLString},
    id: {type: GraphQLString},
  }),
})

module.exports = LinkType
