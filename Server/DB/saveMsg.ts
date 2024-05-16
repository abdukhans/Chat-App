import {config} from "dotenv"


config()


import { Pool, Client } from 'pg'



const saveMsg  = async (msg:string, chat_name:string, user_name:string) => {

    const client = new Client({
       connectionString:process.env.DATABASE_URL_CLIENT
    })




    const curDate =  new Date();

    const ISODate = curDate.toISOString().split('T')[0]

    const query = `INSERT INTO MSGS (chat_name,iat,msg,user_name) VALUES \
                    ('${chat_name}','${ISODate}','${msg}',${user_name}');`


    await client.connect()
    const res = await client.query({ text:query})

    await client.end()
    
                    
}

export {saveMsg}