const { ApolloServer, gql } = require('apollo-server');
let books = require('./resources/books');
let authors = require('./resources/authors');

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String): [Book!]!
    allAuthors: [Author!]!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (!args.author) return books;
      return books.filter(book => 
        args.author === book.author
      );
    },
    allAuthors: () => authors
  },
  Author: {
    bookCount: (root) => {
      return books.filter(book => 
        book.author === root.name
      ).length;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});