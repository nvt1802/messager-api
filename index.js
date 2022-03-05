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

require("./src/routes")(app)
require("./src/socket")(io)

server.listen(port, console.log(`server runing in port ${port}`))
