
export default (sequelize, DataTypes) => {
  return sequelize.define('Team', {
    name: {
      type: DataTypes.STRING,
    }
  })

}