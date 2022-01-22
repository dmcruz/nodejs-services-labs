const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use((req, res, next) => {
  res.send('hello')
  return
})
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`)
})