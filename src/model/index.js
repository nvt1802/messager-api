const { sequelize } = require("../config/database")
const Users = require("./users")
const Role = require("./role")
const Message = require("./message")
const Room = require("./room")
const RoomDetail = require("./room-detail")
const Upload = require("./upload")

;(async () => {
  await sequelize.sync()
})()

module.exports = {
  User: Users.Users,
  Role: Role,
  Message: Message,
  Room,
  RoomDetail,
  Upload,
}
