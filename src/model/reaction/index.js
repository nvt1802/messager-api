const { sequelize, dataTypes } = require("../../config/database");
const Post = require("../post");

const Reaction = sequelize.define(
  "reaction",
  {
    reactionId: {
      type: dataTypes.UUID,
      field: "reactionId",
      primaryKey: true,
      defaultValue: dataTypes.UUIDV4,
    },
    postId: {
      type: dataTypes.UUID,
      validate: {
        notEmpty: true,
      },
      field: "postId",
    },
    userId: {
      type: dataTypes.UUID,
      validate: {
        notEmpty: true,
      },
      field: "userId",
    },
    type: {
      type: dataTypes.INTEGER,
      field: "type",
    },
  },
  { timestamps: true }
);

Reaction.belongsTo(Post);

module.exports = Reaction;
