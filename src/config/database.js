const { Sequelize, DataTypes } = require('sequelize')

module.exports = {
  sequelize: new Sequelize({
    database: process.env.DATABASE,
    username: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }),
  dataTypes: DataTypes,
}
