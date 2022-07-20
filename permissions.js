const isAuthenticated = () => (root, args, context, info) => {
  if (!context.userId) {
    throw new Error('You are not authenticated!')
  }
  return next(root, args, context, info)
}

const hasRole = (role) => (root, args, context, info) => {
  if (!context?.currentUser?.roles || context?.currentUser?.roles?.includes(role)) {
    throw new Error('You are not authorized!')
  }
}


export { hasRole, isAuthenticated }