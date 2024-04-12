const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const server = require('./server/server.js');

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
