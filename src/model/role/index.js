const { sequelize, dataTypes } = require('../../config/database')

const Role = sequelize.define(
  'role',
  {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    roleName: dataTypes.STRING,
  },
  { timestamps: false }
)

module.exports = Role
