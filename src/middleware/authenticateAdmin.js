const jwt = require("jsonwebtoken")
const paths = ["/api/admin"]
const model = require("../model")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null)
    return res.status(401).json({
      succcess: false,
      msg: "Unauthorized !!!",
    })

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "tainv13",
    async (err, user) => {
      if (err) return res.status(401).json(err)
      const userDB = await model.User.findByPk(user.id)
      if (userDB.roleId !== 1) return res.sendStatus(403)
      req.user = user
      next()
    }
  )
}

module.exports = (app) => {
  app.use(
    paths,
    (req, res, next) => {
      next()
    },
    authenticateToken
  )
}
