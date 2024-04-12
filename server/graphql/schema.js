// graphql/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    login(email: String!, password: String!): String!
    signup(username: String!, email: String!, password: String!): String!
  }
`;

module.exports = typeDefs;
