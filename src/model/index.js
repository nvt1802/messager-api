const { sequelize } = require("../config/database")
const Users = require("./users")
const Role = require("./role")
const Message = require("./message")

;(async () => {
  await sequelize.sync()
})()

module.exports = {
  User: Users.Users,
  Role: Role,
  Message: Message,
}
