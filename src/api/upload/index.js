const uploadRouter = require("express").Router()
const fs = require("fs")
const model = require("../../model")
const multer = require("multer")
const pathMD = require("path")
var os = require("os")

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // vị trí upload lên
    callback(null, "./src/public/avatar")
  },
  filename: (req, file, callback) => {
    let math = ["image/png", "image/jpeg"]
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`
      callback(errorMess, null)
    } else {
      const filename = `${Date.now()}-${file.originalname}`
      callback(null, filename)
    }
  },
})

const upload = multer({ storage: storage }).single("files")

uploadRouter.post("/upload-avatar", async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send(req.body.oldPath)
    } else {
      let path = pathMD.join(
        __dirname.split("src")[0],
        `/src/public/avatar/${req.file.filename}`
      )
      try {
        if (!err) {
          res.send(`/avatar/${req.file.filename}`)
        }
      } catch (error) {
        res.send(error)
      }
    }
  })
})

uploadRouter.get("/download-avatar", async (req, res) => {
  let path = pathMD.join(
    __dirname.split("src")[0],
    `/src/public/avatar/${req.query.filename}`
  )
  res.download(path)
})

uploadRouter.get("/list-avatar", async (req, res) => {
  let path = pathMD.join(__dirname.split("src")[0], `/src/public/avatar`)
  try {
    fs.readdir(path, async (err, files) => {
      res.send(
        files?.map((file) => {
          return file
        })
      )
    })
  } catch (error) {
    res.send(error)
  }
})

module.exports = uploadRouter
