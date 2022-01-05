const express = require('express')
const app = express()
const port = process.env.PORT

var boatRouter = require('./router/boat')

app.use(express.json())
app.use('/boat', boatRouter)

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`)
})