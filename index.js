const https = require("https")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000 //
const TOKEN = 'A4jHZn/MAvIAcOJosvVt7cjpwFgHJjnNkk7XkSf4Bnd8aM9uIYuSnx0cPAFnPT3Jt4GGlZ5XBkwlROCr2jSHafMGdlbXU+Bjo+k1SZGJDJnAeADQQl2MTPlWOOiodPQKD2KBuAJ1RAvXOyMz7xKo8wdB04t89/1O/w1cDnyilFU=' // ============= เพิ่มเข้ามาใหม่
const conn = require('./conn')
const cors = require('cors')

app.use(cors())

var menu

conn.query("SELECT * FROM menu", (err, result) => {
    if (err) throw err;
    menu = result.rows
})

app.get('/get/menu', (req, res) => {
    conn.query('SELECT  * FROM "menu"', (err, result) => {
        if (err) throw err;
        menu = result.rows
        res.send(result.rows)
    })
})

function sendMessage(message, req) {
    // Message data, must be stringified
    const dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: message
    })

    // Request header
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + TOKEN
    }

    // Options to pass into the request
    const webhookOptions = {
        "hostname": "api.line.me",
        "path": "/v2/bot/message/reply",
        "method": "POST",
        "headers": headers,
        "body": dataString
    }

    // Define request
    const request = https.request(webhookOptions, (res) => {
        res.on("data", (d) => {
            process.stdout.write(d)
        })
    })

    // Handle error
    request.on("error", (err) => {
        console.error(err)
    })

    // Send data
    request.write(dataString)
    request.end()
}

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.send('สวัสดี express webhook')
})

app.post("/webhook", (req, res) => {
    // console.log('req.body =>', JSON.stringify(req.body, null, 2)) //สิ่งที่ Line ส่งมา
    res.send("HTTP POST request sent to the webhook URL!")

    // ============= เพิ่มเข้ามาใหม่
    if (req.body.events[0].type === "message") {

        const message = req.body.events[0].message.text

        let keyword = "ซื้อสินค้ารหัส:";

        if (message.startsWith(keyword)) {
            const split = message.split(' ')[1]
            const foundItem = menu.find(item => item.code === split);

            if (foundItem) {

                sendMessage([
                    {
                        type: 'text',
                        text: `🙏🏼ขอบคุณที่สั่งสินค้า\n------------------------------------\n🧑🏼‍💻รหัสสินค้า: ${foundItem.code}\n📛ชื่อสินค้า: ${foundItem.name}\n🪙ราคาสินค้า: ${foundItem.price} บาท\n------------------------------------`
                    }
                ], req)
                console.log("พบรหัสในอาร์เรย์");
            } else {
                console.log("ไม่พบรหัสในอาร์เรย์");
            }

        } else {
            console.log("ข้อความไม่เริ่มต้นด้วยคำที่กำหนด");
        }
    }
})

app.post('/insert', (req, res) => {
    var body = req.body

    conn.query("SELECT * FROM menu", (err, result) => {
        if (err) throw err;
        const code = (result.rows.length + 1) + 10000

        var sql = `INSERT INTO "menu"(code, name, price, stock, url) VALUES('${code}', '${body.name}', '${body.price}', '${body.stock}', '${body.url}')`

        conn.query(sql, (err, result, fields) => {
            if (err) throw err;
            res.send({
                message: "Good"
            })
        })
    })
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})