import _ from 'lodash'

export default (resolvers, resolversComposition) => {
  const customResolver = (validators, resolver) => async (root, args, context, info) => {
    for (const validator of validators) {
      validator(root, args, context, info)
    }
    return resolver(root, args, context, info)
  }
  for (const path in resolversComposition) {
    const validators = resolversComposition[path]
    const mappedResolver = resolvers[path]
    _.set(resolvers, path, customResolver(validators, mappedResolver))
  }
  return resolvers
}


