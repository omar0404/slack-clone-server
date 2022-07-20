
export default (sequelize,DataTypes) => {
  return sequelize.define('team',{
    name:{
      type:DataTypes.STRING,
    }
  })

}