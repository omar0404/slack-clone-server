export default `
  type Channel {
    id:Int!
    name:String!
    public:Boolean!
    users:[User!]!
    messages:[Message!]!
  }
  type Mutation {
    createChannel(teamId:Int!,name:String!,public:Boolean=false):Boolean!
  }
`;