const express = require('express')
const mysql = require('mysql')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/upload', (req, res) => {
  const data = req.body

  const myConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })

  myConnection.connect(err => {
    if (err) {
      console.log(err.message)
      return res.status(500).send('Server error...')
    } else {
      //console.log('Connected...')
    }
  })

  myConnection.query(
    `insert into info values('${data.uploadId}', '${data.img1Uri}', '${data.des1}', '${data.img2Uri}', '${data.des2}')`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Server error...' })
      } else {
        res.send(data)
        //console.log('Inserted...')
      }
    }
  )

  myConnection.end(err => {
    if (err) {
      console.log(err.message)
    } else {
      //console.log('Disconnected...')
    }
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`))
