import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import path from 'path';
import user from './schema/user'
import userRs from './resolvers/user'
import express from 'express';
import http from 'http';
import models, { sequelize } from './models';
async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}
const SECRET = 'asiodfhoi1hoi23jnl1kejd';
const SECRET2 = 'asiodfhoi1hoi23jnl1kejasdjlkfasdd';
async function startApolloServer() {
  await assertDatabaseConnectionOk()
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: mergeTypeDefs(loadFilesSync(path.join(__dirname, './schema'))),
    resolvers: mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers'))),
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: req => ({
      models,
      user: req.user,
      secret: SECRET,
      secret2: SECRET2,
    }),
  });

  await server.start();
  server.applyMiddleware({ app });
  models.sequelize.sync({}).then(() => {
    httpServer.listen({ port: 4000 })
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}
startApolloServer()