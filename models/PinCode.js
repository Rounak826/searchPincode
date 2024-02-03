const {  DataTypes } = require('sequelize');
const  sequelize  = require('../DB')

const PinCode = sequelize.define('code', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },    
    pincode:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    district:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    state:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    area:{
        type:DataTypes.STRING,
        allowNull: false,
    },
},
{
    timestamps: false,
}
)

module.exports =  PinCode
