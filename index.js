const express = require('express')
// const { body } = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');

const dayjs = require('dayjs');

const db = require('./connection');
const e = require('express');
// console.log(db)


const app = express()
app.use(cors())
app.use(
    express.urlencoded({
        extended: true
    }), bodyParser.json()
)

const port = 3000

app.get('/queue/:shop_id', async (req, res) => {
    //  get queue from database
    try {
        await db.query(`select * from queue where is_done = false and shop_shop_id = ${req.params.shop_id}`, function (err, rows) {
            if (err) {
                console.log(err)
                res.status(400).send({
                    success: false,
                    msg: `something went wrong: ${err}`
                })
            } else {
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
// creating queue
app.post('/queue', async (req, res) => {
    console.log("creating queue")
    try {
        // get size of queue to generate queue number
        db.query(`select * from queue where is_done = false and shop_shop_id = ${req.body.shop_id}`, function (err, queue) {
            if (err) {
                console.log("test")
                res.status(400).send({
                    success: false,
                    msg: "Something Went Wrong"
                })
            } else {
                var size = queue.length;
                //  check if shope exist
                db.query(`select name from shop where shop_id = ${req.body.shop_id}`, function (err, shop_name) {
                    if (err) {
                        res.status(400).send({
                            success: false,
                            msg: "Something Went Wrong"
                        })
                    } else {
                        if (shop_name.length == 0) {
                            res.status(404).send({
                                success: false,
                                msg: "Shop doesn't exist"
                            })
                        }
                        var queueNumber = shop_name[0].name + "-" + size;
                        // check if person queued up already
                        db.query(`SELECT * FROM queue WHERE phone_number =${req.body.phone_number} and is_done = false`, function (err, exist) {
                            if (err) {
                                console.log(err)
                            } else {
                                if (exist.length > 0) {
                                    res.status(400).send({
                                        success: false,
                                        msg: "Already in the Queue"
                                    })
                                } else {
                                    // insert queue
                                    db.query(`INSERT INTO queue (queue_number,is_done,time_created,phone_number,shop_shop_id,is_alert,acknowledge) 
                        values("${queueNumber}",false,"${dayjs()}",${req.body.phone_number},${req.body.shop_id},false,false);`, function (err) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            res.status(200).send({
                                                success: true,
                                                data: req.body,
                                                queue_number: queueNumber,
                                                msg: "Successfully Entered Queue"

                                            })
                                        }
                                    });


                                }
                            }
                        });

                    }
                });

            }
        });

    } catch (error) {
        res.status(400).send({
            success: false,
            msg: `Error: ${error}`
        })
    }

})
// customer acknowledge queue
app.put('/customer/confrim', (req, res) => {
    var phone_number = req.body.phone_number;
    var shop_id = req.body.shop_id;
    // check if customer is in queue
    db.query(`select queue_id,acknowledge from queue where phone_number = ${phone_number} and shop_shop_id = ${shop_id} and is_done = false`, function (err, exist) {
        if (err) {
            res.status(400).send({
                success: false,
                msg: err
            })
        } else {
            if(exist.length == 0){
                res.status(404).send({
                    success: false,
                    msg: "You're not in queue, please get queue number"
                })
            }
            // console.log(exist[0].acknowledge)
            if(exist[0].acknowledge == 1){
                res.status(400).send({
                    success: false,
                    msg: `You have already confrimed - Phone Number- ${phone_number}`
                })
            }
            else{
                db.query(`UPDATE queue
                SET acknowledge = true
                WHERE queue_id = ${exist[0].queue_id};`, function (err) {
                    if(err){
                        res.status(400).send({
                            success: false,
                            msg: "Something Went Wrong"
                        })
                    }
                    else{
                        res.status(200).send({
                            success: true,
                            msg: `Successfully Confrimed Queue - Phone Number- ${phone_number}`
                        })
                    }
                });
            }

        }
    });

})

// shop move next queue
app.put('/shop/next', (req, res) => {
    // check if customer is in queue
    var shop_id = req.body.shop_id;
    db.query(`select * from queue where is_done = false and shop_shop_id = ${shop_id}`, function (err, exist) {
        if (err) {
            res.status(400).send({
                success: false,
                msg: "Something Went Wrong"
            })
        } else {
            if(exist.length == 0){
                res.status(404).send({
                    success: false,
                    msg: "There is no customers in queue and the shop doesn't exist"
                })
            }
           
            else{
                db.query(`UPDATE queue
                SET is_done = true
                WHERE queue_id = ${exist[0].queue_id};`, function (err) {
                    if(err){
                        res.status(400).send({
                            success: false,
                            msg: "Something Went Wrong"
                        })
                    }
                    else{
                        res.status(200).send({
                            success: true,
                            msg: `Successfully Move to next person in line, Next Queue Number - ${exist[0].queue_number}`
                        })
                    }
                });
            }

        }
    });

})

// set alert to true
app.put('/queue/alert/:shop_id/:phone_number', (req, res) => {
    // check if customer is in queue
    var shop_id = req.params.shop_id;
    var phone_number = req.params.phone_number;
    db.query(`select * from queue where is_done = false and is_alert = false and phone_number = ${phone_number} and shop_shop_id = ${shop_id}`, function (err, exist) {
        if (err) {
            res.status(400).send({
                success: false,
                msg: "Something Went Wrong"
            })
        } else {
            if(exist.length == 0){
                res.status(400).send({
                    success: false,
                    msg: "Customer doesn't exist or alert has been sent"
                })
            }
            else{
                db.query(`UPDATE queue
                SET is_alert = true
                WHERE queue_id = ${exist[0].queue_id};`, function (err) {
                    if(err){
                        res.status(400).send({
                            success: false,
                            msg: "Something Went Wrong"
                        })
                    }
                    else{
                        res.status(200).send({
                            success: true,
                            msg: `Successfully sent alert to ${exist[0].queue_number}`
                        })
                    }
                });
            }

        }
    });

})



app.listen(port, () => {
    console.log(`queue app listening on port ${port}`)
})