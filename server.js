const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Importing schema
const typeDefs = require('./graphql/schema');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String,
}));

// GraphQL resolvers
const resolvers = {
  Query: {
    currentUser: (_, __, { user }) => {
      return user;
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid email or password');
      }
      return jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    },
    signup: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
      return jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    },
  },
};

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = verifyToken(token);
    return { user };
  },
});

// Express App
const app = express();

// Start Apollo Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
