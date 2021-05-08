const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');
const config = require('./utils/config');

mongoose.connect(config.DB_URI, {
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
});

server.listen(config.PORT).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});