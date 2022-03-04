const express = require("express")
const cors = require("cors")
const app = express()
require("dotenv").config()
const server = require("http").createServer(app)
const path = require("path")
const port = process.env.PORT || 4000
const socketioJwt = require("socketio-jwt")

const model = require("./src/model")

app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "./src/views"))
app.use(cors())
app.use(express.json())

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
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
  console.log('runn');
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


require("./src/routes")(app)

server.listen(port, console.log(`server runing in port ${port}`))
