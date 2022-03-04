const messageRouter = require("express").Router()
const model = require("../../model")
const socketioJwt = require("socketio-jwt")

messageRouter.get("/start", async (req, res) => {
  const messages = await model.Message.findAll()
  res.json(messages)
})

const io = require("socket.io")(process.env.PORT_SOCKET, {
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
    // allowedHeaders: ["access-token"],
  },
})

io.use(
  socketioJwt.authorize({
    secret: "access-token-secret-tainv13",
    handshake: true,
    // auth_header_required: true,
  })
)

io.on("connection", (socket) => {
  let listUserTyping = []

  socket.on("send", async (data) => {
    await model.Message.create(data)
    const messages = await model.Message.findAll()
    io.sockets.emit("send", messages)
  })

  socket.on("focusin", (data) => {
    listUserTyping.push(data)
    io.sockets.emit("typing", listUserTyping)
  })
  socket.on("focusout", (data) => {
    listUserTyping = []
    listUserTyping = [
      ...listUserTyping.filter((item, idx) => {
        return item?.username !== data?.username
      }),
    ]

    io.sockets.emit("typing", listUserTyping)
  })
})

module.exports = messageRouter
