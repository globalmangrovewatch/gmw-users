const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

app.enable('trust proxy')
app.use((req, res, next) => {
  req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
})

app.use(express.json())

app.use(express.static(path.join(__dirname, '..', 'build')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build'))
})

app.get('/{*splat}', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build/index.html'))
})

app.listen(port, () => {
  console.log('Server is running on port: ', port)
})
