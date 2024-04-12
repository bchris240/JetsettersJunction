const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./resolvers/userResolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

module.exports = server;
