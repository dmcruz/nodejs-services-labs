'use strict'
const express = require('express')
const app = express()
const router = express.Router()
const { PORT = 3000 } = process.env

function badRequest() {
  const err = new Error('Bad Request')
  err.status = 400
  return err
}

function toUpper(val) {
  return val.toUpperCase()
}

router.get('/', (req, res, next) => {
  setTimeout(() => {
    if (!req.query.un) {
      next(badRequest())
      return
    }
    if (Array.isArray(req.query.un))
      res.send(req.query.un.map(toUpper))
    else 
      res.send(toUpper(req.query.un))
  }, 1000)
})

app.use(router)

app.listen(PORT, () => {
  console.log(`Express server listening on ${PORT}`)
})