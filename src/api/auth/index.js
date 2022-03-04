const authRouter = require('express').Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt-nodejs')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const model = require('../../model')

authRouter.post(
  '/signup',
  body('email')
    .notEmpty()
    .withMessage('Email cannot be blank')
    .isEmail()
    .withMessage('Email invalidate')
    .custom((value) => {
      return model.User.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject('E-mail already in use')
        }
      })
    }),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be blank')
    .isLength({ min: 8 })
    .withMessage('Password is too weak'),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    model.User.create({
      id: uuid.v4(),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
      roleId: 2,
    })
      .then((newUser) => {
        if (!newUser) {
          res.json({ success: false, msg: 'Email already exists' })
        } else {
          res.json({ success: true, msg: 'Successful created new user' })
        }
      })
      .catch((err) => {
        res.json({ success: false, msg: err?.original.detail })
      })
  }
)

// Xử lý thông tin khi có người thực hiện đăng nhập
authRouter.post(
  '/login',
  body('email')
    .notEmpty()
    .withMessage('Email cannot be blank')
    .isEmail()
    .withMessage('Email invalidate'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be blank')
    .isLength({ min: 8 })
    .withMessage('Password is too weak'),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    model.User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((users) => {
      if (!users) {
        res.status(401).json({
          success: false,
          msg: 'Authentication failed. Email not found.',
        })
      } else {
        bcrypt.compare(
          req.body.password,
          users.dataValues.password,
          (err, result) => {
            if (result === true) {
              var token = jwt.sign(
                users.dataValues,
                process.env.ACCESS_TOKEN_SECRET || 'tainv13',
                {
                  expiresIn: '30d',
                }
              )
              res.json({ success: true, token: 'Bearer ' + token })
            } else {
              res.status(401).send({
                success: false,
                msg: 'Authentication failed. Wrong password.',
              })
            }
          }
        )
      }
    })
  }
)

authRouter.get("/userinfo", async (req, res) => {
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
      res.status(200).send(userDB)
    }
  )
})

module.exports = authRouter
