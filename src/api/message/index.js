const messageRouter = require("express").Router()
const model = require("../../model")
const { getPagination, getPagingData } = require("../../common/pagination")

messageRouter.get("/start", async (req, res) => {
  const page = req.query?.page || 1
  const size = req.query?.size || 10
  const pagination = getPagination(page, size)
  const totalItems = await model.Message.findAll().then((res) => res.length)
  const messages = await model.Message.findAll({
    ...pagination,
    order: [["updatedAt", "DESC"]],
  })
  res.json(getPagingData(messages, totalItems, page, size))
})

messageRouter.get("/list-member", async (req, res) => {
  const users = await model.User.findAll()
  res.json(users)
})

module.exports = messageRouter
