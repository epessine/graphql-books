const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/context');
const mongoose = require('mongoose');
const { DB_URI, PORT } = require('./utils/config');

mongoose.connect(DB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false, 
  useCreateIndex: true 
})
  .then(() => {
    console.log('connected to MongoDB!');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen(PORT).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});