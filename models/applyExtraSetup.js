export default (sequelize) => {
  const { User, team, message, channel } = sequelize.models;
  User.belongsToMany(team, { through: 'member', foreignKey: 'userId' })
  team.belongsToMany(User, { through: 'member', foreignKey: 'teamId' })
  message.belongsTo(channel, { foreignKey: 'channelId' })
  message.belongsTo(User, { foreignKey: 'userId' })
  channel.belongsTo(team, { foreignKey: 'teamId' })
}