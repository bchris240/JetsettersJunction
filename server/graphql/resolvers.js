// graphql/resolvers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    currentUser: (_, __, { user }) => user,
  },
  Mutation: {
    async login(_, { email, password }) {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = jwt.sign({ id: user.id }, SECRET_KEY);
      return token;
    },
    async signup(_, { username, email, password }) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AuthenticationError('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser.id }, SECRET_KEY);
      return token;
    },
  },
};

module.exports = resolvers;
