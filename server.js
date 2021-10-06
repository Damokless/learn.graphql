const { ApolloServer, gql } = require("apollo-server");
const fs = require('fs')
const users = require('./users.json')
const posts = require('./posts.json')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type User {
    id: String
    email: String
    password: String
    firstName: String
    lastName: String
  }
  type Post {
    id: String
    author: User
    comments: Post
    content: String
    createdAt: String
    updatedAt: String
  }
  type Query {
    users: [User]
    posts: [Post]
  }
  type Mutation {
    addUser(email: String,password: String,firstname: String,lastname: String): User
  }
`;
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    users: () => users,
    posts: () => posts,
  },
  Mutation: {
    addUser: async (_, data) => {
      data.id = users.length + 1
      users.push(data)
      fs.writeFileSync('./users.json', users)
    },
  },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
