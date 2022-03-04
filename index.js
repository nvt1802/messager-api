const express = require("express")
const cors = require("cors")
const app = express()
require("dotenv").config()
const server = require("http").createServer(app)
const path = require("path")
const port = process.env.PORT || 4000

require("./src/model")

app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "./src/views"))
app.use(cors())
app.use(express.json())


require("./src/routes")(app)

server.listen(port, console.log(`server runing in port ${port}`))
