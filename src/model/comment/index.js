const { sequelize, dataTypes } = require("../../config/database");

const Comment = sequelize.define(
  "comment",
  {
    commentId: {
      type: dataTypes.UUID,
      field: "commentId",
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
    content: {
      type: dataTypes.STRING(2000),
      field: "content",
    },
    commentReplyId: {
      type: dataTypes.UUID,
      validate: {
        notEmpty: true,
      },
      field: "commentReplyId",
    },
  },
  { timestamps: true }
);

module.exports = Comment;
