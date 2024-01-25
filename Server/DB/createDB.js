require('dotenv').config()
const { Pool, Client } = require('pg')
const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
})

async function CreateTable(){

    await client.connect()

    await client.end()

}


module.exports = {CreateTable}