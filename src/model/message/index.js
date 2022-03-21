const { sequelize, dataTypes } = require("../../config/database")

const Message = sequelize.define(
  "message",
  {
    username: dataTypes.STRING,
    message: dataTypes.STRING,
    roomId: dataTypes.UUID,
  },
  { timestamps: true }
)

module.exports = Message
