const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
}));

// GraphQL type definitions
const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    signup(username: String!, password: String!): User!
    login(username: String!, password: String!): String!
  }

  type User {
    id: ID!
    username: String!
    createdAt: String!
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    users: () => User.find(),
    user: (_, { id }) => User.findById(id),
  },
  Mutation: {
    signup: async (_, { username, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword });
      return user;
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid username or password');
      }
      return jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    },
  },
};

// Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Express App
const app = express();

async function startServer() {
  await apolloServer.start();

  // Apply Apollo middleware after server has started
  apolloServer.applyMiddleware({ app });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
