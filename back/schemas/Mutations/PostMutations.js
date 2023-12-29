const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")

const UserType = require("../TypeDefs/UserType")
const PostType = require("../TypeDefs/PostType")

const users = require("../../USER_DATA.json")
const posts = require("../../POST_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")

const PostMutations = {
    createPost: {
        type: PostType,
        args: { 
            id: { type: GraphQLInt},
            secretkey: { type: GraphQLString },
            content: { type: GraphQLString }
        },
    resolve(parent, args) {

        const user = users.find(user => user.id === args.id ? user : null)
        const secret = sensitive[user.id - 1]
        
        if(secret.id != args.id || secret.secretkey != args.secretkey) {
            return
        }
        
        const newPost = {
            id: posts.length + 1,
            content: args.content,
            author: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            },
            date: new Date(),
            views: [],
            likes: [],
            avgRatio: user.avgRatio
        }

        user.posts = [...user.posts, newPost]
        posts.push(newPost)

        let updatedJson = JSON.stringify(posts, null, 2)
        fs.writeFileSync(__dirname + "/../../POST_DATA.json", updatedJson)

        updatedJson = JSON.stringify(users, null, 2)
        fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)


        return newPost
        }
    },
    postViewed: {
        type: PostType,
        args: { post: { type: GraphQLInt }, id: { type: GraphQLInt }, secretkey: { type: GraphQLString }},
        resolve(parent, args) {
           console.log("HEY")
            console.log(args)
            const user = users.find(user => user.id === args.id ? user : null)
            const secret = sensitive[user.id - 1]
            
            if(secret.id != args.id || secret.secretkey != args.secretkey) {
                return
            }

            const post = posts.find(post => post.id === args.post ? post : null)

            
            const viewer = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            }

            const viewerExists = post.views.some(view => view.id === viewer.id);

            if(viewerExists) {
                console.log("EXISTS")
                return
            }

            
            const currentViews = post.views.length + 1
            const currentLikes = post.likes.length
            const ratio = currentLikes / currentViews
            
            
            // const Index = post.posts.findIndex(po => po.id === args.id)

            post.views.push(viewer)
            // user.posts[Index] = post
            
            post.avgRatio = ratio
            user.avgRatio+=ratio


            let updatedJson = JSON.stringify(posts, null, 2)
            fs.writeFileSync(__dirname + "/../../POST_DATA.json", updatedJson)

            updatedJson = JSON.stringify(users, null, 2)
            fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)
            
            return post
        }
    },
    postLiked: {
        type: PostType,
        args: { post: { type: GraphQLInt }, id: { type: GraphQLInt }, secretkey: { type: GraphQLString }},
        resolve(parent, args) {
            const user = users.find(user => user.id === args.id ? user : null)
            const secret = sensitive[user.id - 1]
            
            if(secret.id != args.id || secret.secretkey != args.secretkey) {
                return
            }

            const post = posts.find(post => post.id === args.post ? post : null)
            
            
            const liker = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            }

            const likerExists = post.likes.some(like => like.id === liker.id);

            if(likerExists) {
                console.log("EXISTS")
                return
            }
            
            const currentViews = post.views.length
            const currentLikes = post.likes.length + 1
            const ratio = currentLikes / currentViews

            post.likes.push(liker)
            
            post.avgRatio = ratio
            user.avgRatio+=ratio

            let updatedJson = JSON.stringify(posts, null, 2)
            fs.writeFileSync(__dirname + "/../../POST_DATA.json", updatedJson)

            updatedJson = JSON.stringify(users, null, 2)
            fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)
            
            return post
        }
    }
}

module.exports = PostMutations