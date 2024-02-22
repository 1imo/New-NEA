const {GraphQLObjectType, GraphQLString} = require('graphql')

const SensitiveUserDataType = new GraphQLObjectType({
  name: 'SensitiveUserData',
  fields: () => ({
    id: {type: GraphQLString},
    secretkey: {type: GraphQLString},
  }),
})

module.exports = SensitiveUserDataType
