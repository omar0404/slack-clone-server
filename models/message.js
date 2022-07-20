
export default (sequelize,DataTypes) => {
  return sequelize.define('message',{
    text:{
      type:DataTypes.STRING
    }
  })

}