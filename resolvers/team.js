import { isAuthenticated, hasRole } from "../permissions";

import myComposer from "../myComposer";

const resolvers = {
  Query: {
    getTeams: async (parent, args, { models }) => {
      return models.sequelize.models.Team.findAll();
    }
  },
  Mutation: {
    createTeam: async (parent, args, { models, userId }) => {
      console.log('createTeam', userId)
      if (!userId) return null
      console.log('createTeam')

      try {
        await models.sequelize.models.Team.create({ ...args, owner: userId });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
export default myComposer(resolvers, {
  'Query.getTeams': [isAuthenticated(), hasRole('admin')]
})