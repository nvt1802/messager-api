const uploadRouter = require("express").Router()
const multer = require("multer")
const admin = require("firebase-admin")
const jwt = require("jsonwebtoken")

const upload = multer({
  storage: multer.memoryStorage(),
})

const serviceAccount = require("./tai1802-firebase-adminsdk-lfk9d-255403aadd.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "tai1802.appspot.com",
})

const bucket = admin.storage().bucket()

uploadRouter.post("/upload-avatar", upload.single("files"), (req, res) => {
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
      try {
        if (!req.file) {
          return res.status(400).send("Error: No files found")
        }
        const filePath = `avatar/${user.id}/${req.file.originalname}`
        const blob = bucket.file(filePath)

        const blobWriter = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        })

        blobWriter.on("error", (err) => {
          console.log(err)
        })

        blobWriter.on("finish", () => {
          res.status(200).send(filePath)
        })

        blobWriter.end(req.file.buffer)
      } catch (error) {
        res.json(error)
      }
    }
  )
})

const defaultStorage = admin.storage()

uploadRouter.get("/download-avatar", (req, res) => {
  try {
    const bucket = defaultStorage.bucket()
    const file = bucket.file(req.query?.filePath)
    const options = {
      action: "read",
      expires: "03-17-2025",
    }
    file.getSignedUrl(options).then((results) => {
      if (Array.isArray(results) && results.length > 0) {
        res.json({
          url: results[0],
        })
      } else {
        res.json({
          url: "",
        })
      }
    })
  } catch (error) {
    res.json(error)
  }
})

module.exports = uploadRouter
