const { sequelize, dataTypes } = require("../../config/database")

const Room= require('../room')
const { Users }= require('../users')
const RoomDetail = sequelize.define(
  "room-detail",
  {
    id: {
      type: dataTypes.UUID,
      field: "id",
      primaryKey: true,
      defaultValue: dataTypes.UUIDV4,
    },
  },
  { timestamps: true }
)

RoomDetail.belongsTo(Room)
RoomDetail.belongsTo(Users)

module.exports = RoomDetail
