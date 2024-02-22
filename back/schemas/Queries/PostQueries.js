const graphql = require('graphql')
const {GraphQLInt, GraphQLString} = require('graphql')

const UserType = require('../TypeDefs/UserType')
const PostType = require('../TypeDefs/PostType')

const PostQuery = {
  getPost: {
    type: PostType,
    args: {id: {type: GraphQLInt}},
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        args = sanitise(args)

        const post = await prisma.post.findFirst({
          where: {
            id: args.id,
          },
          select: {
            id: true,
            content: true,
            photo: true,
            user: {
              select: {
                name: true,
                username: true,
                id: true,
              },
            },
          },
        })

        return post
      } catch (e) {
        log(e)
        return
      }
    },
  },
}

module.exports = PostQuery
