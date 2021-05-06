const { ApolloServer, gql } = require('apollo-server');
let books = require('./resources/books');
let authors = require('./resources/authors');
const { v1: uuid } = require('uuid');

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
    allBooks(
      author: String, 
      genre: String
    ): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      born: Int
    ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (!args.author && !args.genre) return books;
      if (args.author && !args.genre)
        return books.filter(book =>
          args.author === book.author
        );
      if (!args.author && args.genre)
        return books.filter(book =>
          book.genres.includes(args.genre)
        );
      if (args.author && args.genre)
        return books.filter(book =>
          args.author === book.author
          && book.genres.includes(args.genre)
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
  },
  Mutation: {
    addBook: (root, args) => {
      if (!authors.map(author => author.name).includes(args.author))
        authors = [...authors, { id: uuid(), name: args.author }];
      const book = { ...args, id: uuid() };
      books = [...books, book];
      return book;
    },
    editAuthor: (root, args) => {
      let res = null;
      authors = authors.map(author => {
        if (author.name === args.name) {
          res = { ...author, born: args.born };
          return res;
        }
        return author;
      });
      return res;
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