import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';
import express from 'express';
import http from 'http';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import cors from 'cors';
import models, { sequelize } from './models';
import './permissions';
import { refreshToken } from './auth';

async function assertDatabaseConnectionOk() {
  console.log('Checking database connection...');
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
const persistUser = async (req, res, next) => {
  const token = req.headers.authorization || '';
  const refreshtoken = req.headers.refreshtoken || '';
  if (token) {
    try {
      const { userId } = jwt.verify(token, SECRET);

      req.userId = userId;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const { token, newRefreshToken } = await refreshToken(refreshtoken, sequelize.models.User, SECRET, SECRET2);
        res.set('Access-Control-Expose-Headers', 'authorization,refreshoken');
        res.set({
          authorization: token,
          refreshoken: newRefreshToken,
        });
      }
    }
  }
  next();
};
async function startApolloServer() {
  await assertDatabaseConnectionOk();
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: mergeTypeDefs(loadFilesSync(path.join(__dirname, './schema'))),
    resolvers: mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers'))),
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req, res }) =>
      // console.log();
      // res.set('Access-Control-Expose-Headers', 'authorization');
      // res.setHeader('authorization', 'asd');
      // console.log(res.headersSent);
      ({
        models,
        userId: req.userId,
        secret: SECRET,
        secret2: SECRET2,
        res,
      })
    ,
  });
  await server.start();
  app.use(cors('*'));

  app.use(persistUser);
  server.applyMiddleware({ app });
  models.sequelize.sync({}).then(() => {
    httpServer.listen({ port: 4000 });
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startApolloServer();
