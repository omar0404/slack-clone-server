import { AuthenticationError } from "apollo-server-core"

const isAuthenticated = () => async (root, args, context, info) => {
  if (!context.userId) {
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    })
    throw new AuthenticationError('You are not authenticated!')
  }
  return true
}




export { isAuthenticated }