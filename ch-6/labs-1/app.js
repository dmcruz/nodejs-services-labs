const express = require('express')
const app = express()
const port = process.env.PORT

var boatRouter = require('./routes/boat')

app.use(express.json())
app.use('/boat', boatRouter)


app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}`)
})