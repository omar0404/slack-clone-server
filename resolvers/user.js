import bcrypt from 'bcrypt'
import { DataTypes, ValidationErrorItem } from 'sequelize';
import { login, register } from '../auth';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => {
      return models.sequelize.models.User.findOne({ where: { id } })
    },
    allUsers: (parent, args, { models }) => models.sequelize.models.User.findAll(),
  },
  Mutation: {
    login: async (_, { email, password }, { models, secret, secret2 }) => {
      return login(email, password, models.sequelize.models.User, secret, secret2)
    },
    register: async (parent, user, { models, secret, secret2 }) => {
      console.log("register")

      try {
        const _user = await models.sequelize.models.User.create(user);
        const [token, refreshToken] = register(_user, secret, secret2)
        return {
          ok: true,
          token,
          refreshToken
        };
      } catch (e) {
        console.log(e)
        return {
          ok: false,
          errors: e?.errors?.map(({ path, message }) => ({ key: path, message })),
        };
      }
    },
  },
};