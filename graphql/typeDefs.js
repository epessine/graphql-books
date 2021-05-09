const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    favoriteGenre: String
  }

  type Token {
    value: String!
  }

  type Book {
    _id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type Author {
    _id: ID!
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
    allUsers: [User!]!
    currentUser: User
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
    addUser(
      username: String!
      password: String!
      favoriteGenre: String
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

module.exports = typeDefs;