import {ApolloServer} from '@apollo/server';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {startStandaloneServer} from '@apollo/server/standalone';
import {typeDefs} from './schema';
import { resolvers } from './resolvers';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(() => {
  app.use(
    '/graphql',
    // cors<cors.CorsRequest>({ origin: ['https://lazy-taskman.vercel.app', 'https://studio.apollographql.com'] }),
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server),
  );

  (new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve))).then(() => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  }).catch((err) => {
    console.error(err);
  });
}).catch((err) => {
  console.error(err);
});



// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// startStandaloneServer(server, {
//   listen: {port: 4000},
// }).then(({url}) => {
//   console.log(`🚀  Server ready at: ${url}`);
// }).catch((err) => {
//   console.error(err);
// });
