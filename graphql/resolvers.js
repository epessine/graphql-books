const { UserInputError } = require('apollo-server');
const Author = require('../models/Author');
const Book = require('../models/Book');

const resolvers = {
  Author: {
    bookCount: async (root) => {
      return await Book.collection.countDocuments({ author: root._id });
    }
  },
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) return await Book.find({}).populate('author');
      if (args.author && !args.genre) {
        const author = await Author.find({ name: args.author });
        return await Book.find({ author })
          .populate('author');
      }
      if (!args.author && args.genre)
        return await Book.find({ genres: args.genre })
          .populate('author');
      if (args.author && args.genre) {
        const author = await Author.find({ name: args.author });
        return await Book.find({
          author,
          genres: args.genre
        })
          .populate('author');
      }
    },
    allAuthors: async () => await Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      let book = new Book({ ...args });
      let author = await Author.findOne({ name: args.author });
      if (author) {
        book.author = author._id;
        try {
          const savedBook = await book.save();
          return Book
            .findOne({ _id: savedBook._id })
            .populate('author');
        } catch (e) {
          throw new UserInputError(e.message, {
            invalidArgs: args,
          });
        }
      }
      const newAuthor = new Author({
        name: args.author,
      });
      author = await newAuthor.save();
      book.author = author._id;
      try {
        const savedBook = await book.save();
        return Book
          .findOne({ _id: savedBook._id })
          .populate('author');
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });
      if (author) {
        author.born = args.born;
        try {
          return await author.save();
        } catch (e) {
          throw new UserInputError(e.message, {
            invalidArgs: args,
          });
        }
      }
      return null;
    }
  }
};

module.exports = resolvers;