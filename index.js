const express = require('express')
// const { body } = require('express-validator');
// const bodyParser = require('body-parser');
const cors = require('cors');


const app = express()
app.use(cors())

const port = 3000

app.get('/queue', (req,res) => {
    const result = []
    console.log("getting queue")
    //  get queue from database
    res.status(200).send({data:result})
})

app.post('/queue', (req,res) => {
    const result = []
    console.log("creating queue")
    //  create queue from database

    res.status(200).send({data:req.body})
})

app.listen(port, () => {
  console.log(`queue app listening on port ${port}`)
})