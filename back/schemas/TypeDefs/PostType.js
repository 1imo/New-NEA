const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } = require("graphql")
const { graphqlHTTP } = require("express-graphql")

const AuthorType = require("./AuthorType")

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLInt},
        content: { type: GraphQLString },
        user: { type: AuthorType },
        photo: { type: GraphQLBoolean },
        date: { type: GraphQLString},
        views: { type: new GraphQLList(AuthorType) },
        likes: { type: new GraphQLList(AuthorType) },
        avgRatio: { type: graphql.GraphQLFloat},
        multiplier: { type: graphql.GraphQLFloat},
    })
})

// const PostDef = gql`
//   type Post {
//     id: Int
//     content: String
//     author: AuthorType
//     date: String
//     views: [Author]
//     likes: [Author]
//     avgRatio: Float
//   }

//   type Query {
//     getPost(id: Int): Post
//     profileInfo(username: String): User
//     getFriends(username: String): User
//   }
// `;

module.exports = PostType