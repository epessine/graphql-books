const { UserInputError, PubSub } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const Author = require('../models/Author');
const Book = require('../models/Book');
const User = require('../models/User');
const pubsub = new PubSub();

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
    allUsers: async () => await User.find({}, { passwordHash: 0 }),
    currentUser: (root, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) throw new UserInputError('wrong credentials');
      let book = new Book({ ...args });
      let author = await Author.findOne({ name: args.author });
      if (author) {
        book.author = author._id;
        try {
          const savedBook = await book.save();
          const populatedBook = await Book
            .findOne({ _id: savedBook._id })
            .populate('author');
          pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook });
          return populatedBook;
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
        const populatedBook = await Book
          .findOne({ _id: savedBook._id })
          .populate('author');
        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook });
        return populatedBook;
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) throw new UserInputError('wrong credentials');
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
    },
    addUser: async (root, args) => {
      const hash = await bcrypt.hash(args.password, 4);
      const user = new User({ 
        username: args.username,
        passwordHash: hash,
        favoriteGenre: args.favoriteGenre
      });
      try {
        return await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const isCorrectPassword = await bcrypt.compare(args.password, user.passwordHash);
      if ( !user || !isCorrectPassword ) {
        throw new UserInputError('wrong credentials');
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, SECRET_KEY) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
};

module.exports = resolvers;