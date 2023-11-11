import {ApolloServer} from '@apollo/server';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {startStandaloneServer} from '@apollo/server/standalone';
import {typeDefs} from './schema';
import { resolvers } from './resolvers';
import 'dotenv/config';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: {port: 4000},
}).then((url) => {
  console.log(`🚀  Server ready at: ${url}`);
}).catch((err) => {
  console.error(err);
});

