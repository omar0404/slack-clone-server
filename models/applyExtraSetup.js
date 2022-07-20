export default (sequelize) => {
  const { User, Team, message, channel } = sequelize.models;
  User.belongsToMany(Team, { through: 'member', foreignKey: 'userId' })
  Team.belongsToMany(User, { through: 'member', foreignKey: 'teamId' })
  message.belongsTo(channel, { foreignKey: 'channelId' })
  message.belongsTo(User, { foreignKey: 'userId' })
  channel.belongsTo(Team, { foreignKey: 'teamId' })
}


/*
team:{
  member:userId
}
user:{
  team:teamId
}
*/