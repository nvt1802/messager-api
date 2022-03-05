const { sequelize, dataTypes } = require("../../config/database")
const Role = require("../role")
const Users = sequelize.define("users", {
  id: {
    type: dataTypes.UUID,
    field: "id",
    primaryKey: true,
    defaultValue: dataTypes.UUIDV4,
  },
  email: {
    type: dataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    field: "email",
  },
  name: {
    type: dataTypes.STRING,
    validate: {
      notEmpty: false,
    },
    field: "name",
  },
  birthday: {
    type: dataTypes.STRING,
    validate: {
      notEmpty: false,
    },
    field: "birthday",
  },
  gender: {
    type: dataTypes.BOOLEAN,
    validate: {
      notEmpty: false,
    },
    field: "gender",
  },
  password: {
    type: dataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    field: "password",
  },
  avatar: {
    type: dataTypes.STRING(1000),
    validate: {
      notEmpty: false,
    },
    field: "avatar",
  },
})

Users.belongsTo(Role)

module.exports = { Users }
