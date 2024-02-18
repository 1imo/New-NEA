const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")

const UserType = require("../TypeDefs/UserType")
const PostType = require("../TypeDefs/PostType")

const users = require("../../USER_DATA.json")
const posts = require("../../POST_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")
const LinkType = require("../TypeDefs/LinkType")

const PostMutations = {
    createPost: {
        type: LinkType,
        args: { 
            id: { type: GraphQLString},
            secretkey: { type: GraphQLString },
            content: { type: GraphQLString },
            photo: { type: GraphQLBoolean }
        },
    async resolve(parent, args, { prisma }) {
        const exists = await prisma.userData.count({
            where: { 
                AND: [
                    {id: args.id},
                    {secretkey: args.secretkey}
                ]
            }
        })

        if(!exists) {
            return
        }


        const post = await prisma.post.create({
            data: {
                content: args.content,
                userId: args.id,
                photo: args.photo
            },
            select: {
                id: true
            }
        })
        


        return {
            url: `/post/id/${post.id}`,
            id: post.id
        }

        }
    },
    postViewed: {
        type: LinkType,
        args: { post: { type: GraphQLInt }, id: { type: GraphQLString }, secretkey: { type: GraphQLString }},
        async resolve(parent, args) {
            const exists = await prisma.userData.count({
                where: { 
                    AND: [
                        {id: args.id},
                        {secretkey: args.secretkey}
                    ]
                }
            })
    
            if(!exists) {
                return
            }


            const post = await prisma.post.findFirst({
                where: {
                    id: args.post
                },
                select: {
                    viewedBy: {
                        where: {
                            userId: args.id
                        }
                    },
                    avgRatio: true
                }
            })

            if(!post.viewedBy) {
     
                const inDepth = await prisma.post.findFirst({
                    where: {
                        id: args.post
                    },
                    select: {
                        viewedBy: true,
                        likedBy: true,
                        avgRatio: true
                    }
                })

                const ratio = inDepth.likedBy.length / (inDepth.viewedBy + 1)

                await prisma.ViewedPost.create({
                    data: {
                        postId: args.post,
                        userId: args.id,
                        avgRatio: ratio
                    }
                })

            }

            
           
            
            return {
                url: "#"
            }
        }
    },
    postLiked: {
        type: LinkType,
        args: { post: { type: GraphQLInt }, id: { type: GraphQLInt }, secretkey: { type: GraphQLString }},
        async resolve(parent, args) {

            console.log("LIKE")

            try {
                const exists = await prisma.userData.count({
                    where: { 
                        AND: [
                            {id: args.id},
                            {secretkey: args.secretkey}
                        ]
                    }
                })
        
                if(!exists) {
                    return
                }
    
                const post = await prisma.post.findFirst({
                    where: {
                        id: args.post
                    },
                    select: {
                        likedBy: {
                            where: {
                                userId: args.id
                            }
                        },
                        avgRatio: true
                    }
                })
    
                if(!post.likedBy) {
         
                    const inDepth = await prisma.post.findFirst({
                        where: {
                            id: args.post
                        },
                        select: {
                            viewedBy: true,
                            likedBy: true,
                            avgRatio: true
                        }
                    })

                    
                    const ratio = (inDepth.likedBy.length + 1) / inDepth.viewedBy
    
                    await prisma.LikedPost.create({
                        data: {
                            postId: args.post,
                            userId: args.id,
                            avgRatio: ratio
                        }
                    })
    
                }
                
                return 
            } catch (e) {
                console.log(e)
                return
            }

        }
    }
}

module.exports = PostMutations