const { sequelize, dataTypes } = require("../../config/database")

const Message = sequelize.define(
  "message",
  {
    username: dataTypes.STRING,
    message: dataTypes.STRING,
    avatar: dataTypes.STRING,
  },
  { timestamps: false }
)

module.exports = Message
