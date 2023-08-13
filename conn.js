const { Pool } = require('pg')

const conn = new Pool({
  connectionString: "postgres://default:B35yAwfQCSzT@ep-flat-brook-60149672-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
})

if(conn){
    console.log("Connect");
}

module.exports = conn