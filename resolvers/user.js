import bcrypt from 'bcrypt'
import { DataTypes, ValidationErrorItem } from 'sequelize';
import { login } from '../auth';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.sequelize.models.User.findAll(),
  },
  Mutation: {
    login: async (_, { email, password }, { models, secret, secret2 }) => (
      login(email, password, models.sequelize.models.User, secret, secret2)
    ),
    register: async (parent, user, { models }) => {
      try {
        await models.sequelize.models.User.create(user);
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          errors: e.errors.map(({ path, message }) => ({ key: path, message })),
        };
      }
    },
  },
};