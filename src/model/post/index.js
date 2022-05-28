const { sequelize, dataTypes } = require("../../config/database");

const Post = sequelize.define(
  "post",
  {
    id: {
      type: dataTypes.UUID,
      field: "id",
      primaryKey: true,
      defaultValue: dataTypes.UUIDV4,
    },
    postBy: {
      type: dataTypes.STRING,
      validate: {
        notEmpty: true,
      },
      field: "postBy",
    },
    tagsWith: {
      type: dataTypes.STRING,
      validate: {
        notEmpty: false,
      },
      field: "tagsWith",
    },
    content: {
      type: dataTypes.STRING,
      validate: {
        notEmpty: false,
      },
      field: "content",
    },
    resources: {
      type: dataTypes.STRING(9000),
      validate: {
        notEmpty: false,
      },
      field: "resources",
    },
  },
  { timestamps: true }
);

module.exports = Post;
