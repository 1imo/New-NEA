const graphql = require('graphql')
const {GraphQLInt, GraphQLString, GraphQLBoolean} = require('graphql')
const LinkType = require('../TypeDefs/LinkType')

const PostMutations = {
  createPost: {
    type: LinkType,
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      content: {type: GraphQLString},
      photo: {type: GraphQLBoolean},
    },
    async resolve(parent, args, {prisma, auth, sanitise, log}) {
      try {
        args = sanitise(args)
        const exists = await auth(args.id, args.secretkey)

        const post = await prisma.post.create({
          data: {
            content: args.content,
            userId: args.id,
            photo: args.photo,
          },
          select: {
            id: true,
          },
        })

        return {
          url: `/post/id/${post.id}`,
          id: post.id,
        }
      } catch (e) {
        log(e)
        return
      }
    },
  },
  // Viewing a Post
  postViewed: {
    type: LinkType,
    args: {
      post: {type: GraphQLInt},
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
    },
    async resolve(parent, args, {auth, sanitise, log}) {
      try {
        args = sanitise(args)
        const exists = await auth(args.id, args.secretkey)

        const post = await prisma.post.findFirst({
          where: {
            id: args.post,
          },
          select: {
            viewedBy: {
              where: {
                userId: args.id,
              },
            },
            avgRatio: true,
          },
        })

        if (!post.viewedBy) {
          const inDepth = await prisma.post.findFirst({
            where: {
              id: args.post,
            },
            select: {
              viewedBy: true,
              likedBy: true,
              avgRatio: true,
            },
          })

          const ratio = inDepth.likedBy.length / (inDepth.viewedBy + 1)

          await prisma.ViewedPost.create({
            data: {
              postId: args.post,
              userId: args.id,
              avgRatio: ratio,
            },
          })
        }

        return
      } catch (e) {
        log(e)
        return
      }
    },
  },
  postLiked: {
    type: LinkType,
    args: {
      post: {type: GraphQLInt},
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
    },
    async resolve(parent, args, {auth, sanitise, log}) {
      try {
        args = sanitise(args)
        const exists = await auth(args.id, args.secretkey)

        const post = await prisma.post.findFirst({
          where: {
            id: args.post,
          },
          select: {
            likedBy: {
              where: {
                userId: args.id,
              },
            },
            avgRatio: true,
          },
        })

        if (!post.likedBy) {
          const inDepth = await prisma.post.findFirst({
            where: {
              id: args.post,
            },
            select: {
              viewedBy: true,
              likedBy: true,
              avgRatio: true,
            },
          })

          const ratio = (inDepth.likedBy.length + 1) / inDepth.viewedBy

          await prisma.LikedPost.create({
            data: {
              postId: args.post,
              userId: args.id,
              avgRatio: ratio,
            },
          })
        }

        return
      } catch (e) {
        log(e)
        return
      }
    },
  },
}

module.exports = PostMutations
