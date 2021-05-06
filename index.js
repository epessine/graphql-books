const { ApolloServer, gql } = require('apollo-server');
let books = require('./resources/books');
let authors = require('./resources/authors');

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});