import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createToken = (user, secert, secret2) => {
  const token = jwt.sign({ userId: user.id }, secert, { expiresIn: '1h' })
  const refreshToken = jwt.sign(
    { userId: user.id },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [token, refreshToken];
}
export const refreshToken = async (refreshToken, userModel, secert, secret2) => {
  const { userId } = jwt.decode(refreshToken)
  if (!userId)
    return {}
  let user;
  try {
    user = await userModel.findOne({ where: { id: userId } })
  } catch (error) {
    return {}
  }
  const [token, newRefreshToken] = createToken(user, secert, secret2)
  return {
    token,
    newRefreshToken,
    user
  }
}
export const register = (user, secret, secret2) => {
  const [token, refreshToken] = createToken(user, secret, user.password + secret2);
  return [token, refreshToken]
}
export const login = async (email, password, userModel, secret, secret2) => {
  const user = await userModel.findOne(({ where: { email }, raw: true }));
  if (!user) {
    return {
      ok: false,
      errors: [{ key: 'email', message: 'email not found' }],
    };
  }
  console.log(user)
  console.log(password)
  console.log(user.password)
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return {
      ok: false,
      errors: [{ key: 'password', message: 'wrong password' }],
    };
  }

  const [token, refreshToken] = createToken(user, secret, user.password + secret2);
  return {
    ok: true,
    token,
    refreshToken,
  };
};