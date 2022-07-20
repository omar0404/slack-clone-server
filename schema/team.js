export default `
  type Team {
    name: String!
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
  type Query {
    getTeams:[Team]
  }
  type Mutation {
    createTeam(name:String!):Boolean
  }

`;