import {config} from "dotenv"


config()


import { Pool, Client } from 'pg'
const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
})

async function JoinChatDB(chat_name:string, user_name:string){
const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
    })


    await client.connect()



    const query = `INSERT INTO CHAT_USER (chat_name,user_name) VALUES ('${chat_name}','${user_name}');`
    

        
    const res = await client.query({ text:query})
    
        
   
     

        
    
    await client.end()


}


// module.exports = {CreateTable}

export  {JoinChatDB}