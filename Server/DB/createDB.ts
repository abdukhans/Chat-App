import {config} from "dotenv"


config()


import { Pool, Client } from 'pg'
const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
})

async function CreateTable(){

    await client.connect()

    await client.end()

}


// module.exports = {CreateTable}

export  {CreateTable}