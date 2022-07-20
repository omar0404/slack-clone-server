
export default (sequelize,DataTypes) => {
  return sequelize.define('channel',{
    text:{
      type:DataTypes.STRING
    }
  })

}