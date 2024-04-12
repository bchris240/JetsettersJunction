// server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('server/graphql/schema.js');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./config/db');
const { verifyToken } = require('./helpers/auth');

const app = express();
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = verifyToken(token);
    return { user };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
