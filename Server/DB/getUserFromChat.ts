
import {config} from "dotenv"
import { query } from "express"


config()
import  { Pool, Client } from 'pg'
import { login } from "../controllers/auth"



const getUsersFromChat = async  (chat_name:string): Promise<any[]> =>{

    
    const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
    })


    await client.connect()



    //const InsertToChats = `INSERT INTO CHATS VALUES ('${chat_name}','${user_name}'); `
    
    //const InsertToChatUser = `INSERT INTO CHAT_USER (chat_name,user_name) VALUES ('${chat_name}','${user_name}');`

    const query = `SELECT user_name FROM CHAT_USER WHERE chat_name = '${chat_name}'; `
        
   
    const res = await client.query({ text:query})
        
    

        
    
    await client.end()


    return res.rows;


}



export {getUsersFromChat};
