import {ApolloServer} from '@apollo/server';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {startStandaloneServer} from '@apollo/server/standalone';
import {typeDefs} from './schema';
import { resolvers } from './resolvers';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import 'dotenv/config';

const PORT = Number(process.env.PORT) || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: {port: PORT},
}).then(({url}) => {
  console.log(`🚀  Server ready at: ${url}`);
}).catch((err) => {
  console.error(err);
});
