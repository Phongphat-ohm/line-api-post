const { Pool, Client}  = require('pg')

const conn = new Pool({
    host: "satao.db.elephantsql.com",
    user: "mtrkomvv",
    password: "0C6-50Wh_VlxgU6NP-_aSLo6c-UFTNS9",
    database: "mtrkomvv"
})

if(conn){
    console.log("COnnection!");
}

module.exports = conn