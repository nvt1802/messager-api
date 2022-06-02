const messageRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const model = require("../../model");
const { getPagination, getPagingData } = require("../../common/pagination");

messageRouter.get("/start", async (req, res) => {
  const page = req.query?.page || 1;
  const size = req.query?.size || 10;
  const pagination = getPagination(page, size);
  try {
    const totalItems = await model.Message.findAll().then((res) => res.length);
    const messages = await model.Message.findAll({
      ...pagination,
      where: {
        roomId: req.query?.roomId || "",
      },
      order: [["updatedAt", "DESC"]],
    });
    res.json(getPagingData(messages, totalItems, page, size));
  } catch (error) {
    res.json(error);
  }
});

messageRouter.get("/list-member", async (req, res) => {
  const users = await model.User.findAll();
  res.json(users);
});

messageRouter.get("/list-room", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({
      succcess: false,
      msg: "Unauthorized !!!",
    });

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "tainv13",
    async (err, user) => {
      if (err) return res.status(401).json(err);
      try {
        const userDB = await model.User.findByPk(user.id);
        const listRoom = await model.RoomDetail.findAll({
          where: {
            userId: userDB?.id,
          },
          include: [
            {
              model: model.Room,
            },
          ],
          order: [["updatedAt", "DESC"]],
        });
        res.json(listRoom);
      } catch (error) {
        res.json(error);
      }
    }
  );
});

messageRouter.get("/list-member-of-room", async (req, res) => {
  const { roomId = "" } = req.query;
  try {
    const listRoom = await model.RoomDetail.findAll({
      where: {
        roomId: roomId,
      },
    });
    const users = await model.User.findAll({
      where: {
        id: listRoom.map((item) => item?.userId),
      },
    });
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

messageRouter.get("/test", async (req, res) => {
  const email = req.query.email;
  model.User.findAll({
    where: {
      email: email,
    },
  }).then(async (result) => {
    res.json(result);
  });
});

messageRouter.post("/update-profile", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({
      succcess: false,
      msg: "Unauthorized !!!",
    });

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "tainv13",
    async (err, user) => {
      if (err) return res.status(401).json(err);
      try {
        const { name, birthday, gender, avatar } = req.body;
        const userDB = await model.User.findByPk(user.id);
        userDB.name = name;
        userDB.birthday = birthday;
        userDB.gender = gender;
        userDB.avatar = avatar;
        userDB.save();
        const newUserDB = await model.User.findByPk(user.id);
        res.json(newUserDB);
      } catch (error) {
        res.json(error);
      }
    }
  );
});

const getListPost = async (list = []) => {
  return await Promise.all(
    list.map(async (item) => {
      const listReaction = await model.Reaction.findAll({
        where: { postId: item?.id },
      });
      const listComment = await model.Comment.findAll({
        where: { postId: item?.id },
      });
      const newListComment = await Promise.all(
        listComment.map(async (itm) => {
          const user = await model.User.findOne({
            where: { id: itm?.dataValues?.userId },
          });
          return {
            ...itm?.dataValues,
            avatar: user?.avatar,
            name: user?.name,
          };
        })
      );
      return {
        ...item.dataValues,
        reaction: {
          listReaction,
          totalLike: listReaction.filter((react) => react?.type === 1).length,
          totalReactType2: listReaction.filter((react) => react?.type === 2)
            .length,
          totalReactType3: listReaction.filter((react) => react?.type === 3)
            .length,
          totalReactType4: listReaction.filter((react) => react?.type === 4)
            .length,
        },
        comment: {
          listComment: newListComment,
          totalComment: newListComment.length,
        },
      };
    })
  );
};

messageRouter.get("/list-post", async (req, res) => {
  const page = req.query?.page || 1;
  const size = req.query?.size || 10;
  const pagination = getPagination(page, size);
  try {
    const totalItems = await model.Post.findAll().then((res) => res.length);
    const listPost = await model.Post.findAll({
      ...pagination,
      order: [["updatedAt", "DESC"]],
    });
    // const listReaction = await model.Reaction.findAll();
    res.json(
      getPagingData(
        { listPost: await getListPost(listPost) },
        totalItems,
        page,
        size
      )
    );
  } catch (error) {
    res.json(error);
  }
});

module.exports = messageRouter;
