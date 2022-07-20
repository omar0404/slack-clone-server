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
export const login = async (email, password, userModel, secret, secret2) => {
  const user = userModel.findOne(({ where: { email }, raw: true }));
  if (!user) {
    return {
      ok: false,
      errors: [{ key: 'email', message: 'email not found' }],
    };
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return {
      ok: false,
      errors: [{ key: 'password', message: 'wrong password' }],
    };
  }

  const [token, refreshToken] = createToken(user, secret, secret2);
  return {
    ok: true,
    token,
    refreshToken,
  };
};