const messageRouter = require("express").Router()
const model = require("../../model")

messageRouter.get("/start", async (req, res) => {
  const messages = await model.Message.findAll()
  res.json(messages)
})

module.exports = messageRouter
