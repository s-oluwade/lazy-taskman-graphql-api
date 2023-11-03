import {ApolloServer} from '@apollo/server';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {startStandaloneServer} from '@apollo/server/standalone';
import {typeDefs} from './schema.ts';
import { resolvers } from './resolvers.ts';
import 'dotenv/config';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const {url} = await startStandaloneServer(server, {
  listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);

// sequelize-auto -h containers-us-west-69.railway.app -d railway -u root -x v7pGlcmq4P5cDZEv1Fti -p 5820  --dialect mysql -c [/path/to/config] -o [/path/to/models]

// async function doStuffWithUserModel() {
//   const newUser = await Employee.create({
//     name: 'Johnny',
//     preferredName: 'John',
//   });
//   console.log(newUser.id, newUser.name, newUser.preferredName);

//   const foundUser = await Employee.findOne({ where: { name: 'Johnny' } });
//   if (foundUser === null) return;
//   console.log(foundUser.name);
// }
