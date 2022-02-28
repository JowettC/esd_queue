const express = require('express')
// const { body } = require('express-validator');
// const bodyParser = require('body-parser');
const cors = require('cors');

const dayjs = require('dayjs');

const db = require('./connection');
const e = require('express');
// console.log(db)


const app = express()
app.use(cors())

const port = 3000

app.get('/queue', async (req, res) => {
    console.log("getting queue")
    //  get queue from database
    try {
        await db.query("select * from queue", function(err,rows){
            if(err){
                console.log(err)
                res.status(400).send({
                    success: false,
                    msg: `something went wrong: ${err}` 
                })
            }else{
                // console.log(rows)
                res.status(200).send({
                    success: true,
                    data: rows
                })
            }
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: `something went wrong: ${error}` 
        })
    }
})

app.post('/queue', async (req, res) => {
    const result = []
    console.log("creating queue")
    //  create queue from database
    const size =0;
    const shopName = ""
    try {
        // get size of queue
        db.query("select * from queue", function(err,rows){
            if(err){
                console.log(err)
            }else{
                size = rows.length;
            }
        });
        console.log(size)
        res.status(200).send({
                        data: size
                    })
        // await db.query(`select name from shop where shop_id = ${req.body.shop_id}` , function(err,shop_name){
        //     if(err){
        //         console.log(err)
        //     }else{
        //         shopName = shop_name;
        //     }
        // });


        
        // db.query(`INSERT INTO queue (queue_number,is_done,time_created,phone_number,shop_shop_id,is_alert,acknowledge) 
        // values(${req.body.queue_number},false,${dayjs()}}",${req.body.phone_number},${req.body.shop_id},false,false);`, function(err){
        //     if(err){
        //         console.log(err)
        //     }else{
        //         res.status(200).send({
        //             data: req.body
        //         })
        //     }
        // });
    } catch (error) {
        console.log(error)
    }
    
})

app.put('/queue', (req, res) => {
    const phone_number = body.req.phone_number
    console.log("creating queue")
    //  create queue from database

    res.status(200).send({
        data: req.body
    })
})


app.listen(port, () => {
    console.log(`queue app listening on port ${port}`)
})