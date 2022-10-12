import { UserInputError } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import { DataTypes, ValidationErrorItem } from 'sequelize';
import { login, refreshToken, register } from '../auth';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.sequelize.models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.sequelize.models.User.findAll(),

  },
  Mutation: {
    login: async (_, { email, password }, { models, secret, secret2 }) => {
      const { ok, errors, ...rest } = await login(email, password, models.sequelize.models.User, secret, secret2);
      if (!ok) {
        throw new UserInputError('Invalid input.', {
          errors,
        });
      }
      return { ok, ...rest };
    },
    register: async (parent, user, { models, secret, secret2 }) => {
      console.log('register');

      try {
        const _user = await models.sequelize.models.User.create(user);
        const [token, refreshToken] = register(_user, secret, secret2);
        return {
          ok: true,
          token,
          refreshToken,
        };
      } catch (e) {
        console.log(e);
        const errors = e?.errors?.map(({ path, message }) => ({ key: path, message }));
        throw new UserInputError('Invalid input.', {
          errors,
        });
      }
    },
  },
};
