const { sequelize, dataTypes } = require("../../config/database")

const Room = sequelize.define(
  "room",
  {
    id: {
      type: dataTypes.UUID,
      field: "id",
      primaryKey: true,
      defaultValue: dataTypes.UUIDV4,
    },
    roomName: {
      type: dataTypes.STRING,
      validate: {
        notEmpty: true,
      },
      field: "roomName",
    },
    password: {
      type: dataTypes.STRING,
      validate: {
        notEmpty: true,
      },
      field: "password",
    },
  },
  { timestamps: true }
)

module.exports = Room
