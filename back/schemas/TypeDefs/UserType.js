const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const postData = require("../../POST_DATA.json")
const PostType = require("./PostType")
// const ChatroomType = require("./ChatroomType")



const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLInt},
        username: { type: GraphQLString},
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString},
        posts: { type: new GraphQLList(PostType),
            resolve(parent, args) {
              // Retrieve the posts for the current user
              const posts = [];
              for (const post of postData) {
                if (post.author.id === parent.id) {
                  posts.push(post);
                }
              }
              return posts 
            }
        },
        friends: { type: new GraphQLList(UserType) },
        followers: { type: new GraphQLList(UserType) },
        following: { type: new GraphQLList(UserType) },
        friendCount: { type: GraphQLInt },
        followerCount: { type: GraphQLInt },
        followingCount: { type: GraphQLInt },
        pending: { type: new GraphQLList(UserType) },
        chatrooms: { type: new GraphQLList(GraphQLInt) },
        avgRatio: { type: graphql.GraphQLFloat}
    })
})

module.exports = UserType