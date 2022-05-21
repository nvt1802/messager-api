const socketioJwt = require("socketio-jwt");
const uuid = require("uuid");
const model = require("../model");
const { getPagination, getPagingData } = require("../common/pagination");

function removeItem(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

module.exports = (io) => {
  let listTyping = [];

  io.use(
    socketioJwt.authorize({
      secret: process.env.ACCESS_TOKEN_SECRET,
      handshake: true,
      // auth_header_required: true,
    })
  );

  io.on("connection", async (socket) => {
    const listRoom = await model.Room.findAll();
    listRoom.forEach((room) => {
      socket.on(`send-room-${room?.id}`, async (data) => {
        await model.Message.create(data);
        const page = 1;
        const size = data.size || 10;
        const pagination = getPagination(page, size);
        const totalItems = await model.Message.findAll().then(
          (res) => res.length
        );
        try {
          const messages = await model.Message.findAll({
            ...pagination,
            where: {
              roomId: room?.id || "",
            },
            order: [["updatedAt", "DESC"]],
          });
          io.sockets.emit(
            `send-room-${room?.id}`,
            getPagingData(messages, totalItems, page, size).payload
          );
          const userrr = await model.User.findOne({
            where: {
              email: data?.username,
            },
          });
          io.sockets.emit(`notification`, {
            ...data,
            email: data.username,
            name: userrr.name,
          });
        } catch (_error) {}
      });

      socket.on(`typing-room-${room?.id}`, (data) => {
        io.sockets.emit(`typing-room-${room?.id}`, data);
      });
    });

    socket.on("create-room", async (data) => {
      try {
        const newId = uuid.v4();
        const { listUser = [] } = data;
        await model.Room.create({
          id: newId,
          ...data,
        });
        listUser.forEach(async (item) => {
          model.User.findAll({
            where: {
              email: item,
            },
          }).then(async (res) => {
            await model.RoomDetail.create({
              id: uuid.v4(),
              roomId: newId,
              userId: res[0]?.id,
            });
          });
        });
        const userDB = await model.User.findByPk(data.userId);
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
        io.sockets.emit("refesh-list-room", true);
      } catch (_error) {
        console.log(_error);
        io.sockets.emit("refesh-list-room", false);
      }
    });

    socket.on("rename-room", async (data) => {
      try {
        await model.Room.findOne({ where: { id: data?.roomId } }).then(
          (res) => {
            res.set(data?.room);
            res.save();
          }
        );
        io.sockets.emit("refesh-list-room", true);
      } catch (_error) {
        console.log(_error);
        io.sockets.emit("refesh-list-room", false);
      }
    });

    socket.on("leave-room", async (data) => {
      try {
        await model.RoomDetail.findOne({
          where: { roomId: data?.roomId, userId: data?.userId },
          include: [
            {
              model: model.Room,
            },
          ],
        }).then((res) => {
          res.destroy();
        });
        io.sockets.emit("refesh-list-room", true);
      } catch (_error) {
        console.log(_error);
        io.sockets.emit("refesh-list-room", false);
      }
    });

    socket.on("online", async (data) => {
      await model.User.update(
        { isOnline: true },
        {
          where: {
            email: data?.email || "",
          },
        }
      );
      const users = await model.User.findAll({
        where: {
          isOnline: true,
        },
      });
      io.sockets.emit("online", users);
    });

    socket.on("disconnect", async () => {
      await model.User.update(
        { isOnline: true },
        {
          where: {
            email: socket?.decoded_token?.email || "",
          },
        }
      );
      const users = await model.User.findAll({
        where: {
          isOnline: false,
        },
      });
      io.sockets.emit("online", users);
    });
  });
};
