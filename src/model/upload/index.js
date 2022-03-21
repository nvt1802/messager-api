const { sequelize, dataTypes } = require("../../config/database")

const Upload = sequelize.define(
  "upload",
  {
    avatar: dataTypes.STRING(50000),
  },
  { timestamps: true }
)

module.exports = Upload
