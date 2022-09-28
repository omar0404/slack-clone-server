import { isAuthenticated, } from "../permissions";
import myComposer from "../myComposer";

const resolvers = {
  Query: {
    getTeams: async (parent, args, { models, userId }) => {
      return models.sequelize.models.Team.findAll({ owner: userId });
    }
  },
  Mutation: {
    createTeam: async (parent, args, { models, userId }) => {
      if (!userId) return null

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
  'Query.getTeams': [isAuthenticated()]
})