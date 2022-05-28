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
    res.json(getPagingData(listPost, totalItems, page, size));
  } catch (error) {
    res.json(error);
  }
});

module.exports = messageRouter;
