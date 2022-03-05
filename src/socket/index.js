const socketioJwt = require("socketio-jwt")
const model = require("../model")
const { getPagination, getPagingData } = require("../common/pagination")

function removeItem(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax
  while (L > 1 && arr.length) {
    what = a[--L]
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1)
    }
  }
  return arr
}

module.exports = (io) => {
  let listTyping = []

  io.use(
    socketioJwt.authorize({
      secret: process.env.ACCESS_TOKEN_SECRET,
      handshake: true,
      // auth_header_required: true,
    })
  )

  io.on("connection", (socket) => {
    socket.on("send", async (data) => {
      await model.Message.create(data)
      const page = 1
      const size = data.size || 10
      const pagination = getPagination(page, size)
      const totalItems = await model.Message.findAll().then((res) => res.length)
      const messages = await model.Message.findAll({
        ...pagination,
        order: [["updatedAt", "DESC"]],
      })
      io.sockets.emit(
        "send",
        getPagingData(messages, totalItems, page, size).payload
      )
    })

    socket.on("typing", (data) => {
      io.sockets.emit("typing", data)
    })
  })
}
