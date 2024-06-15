import {config} from "dotenv"


config()
import  { Pool, Client } from 'pg'


const getChatsFromUserDB = async  (user_name:string): Promise<any[]> =>{

    
    const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
    })


    



    //const InsertToChats = `INSERT INTO CHATS VALUES ('${chat_name}','${user_name}'); `
    
    //const InsertToChatUser = `INSERT INTO CHAT_USER (chat_name,user_name) VALUES ('${chat_name}','${user_name}');`

    const query = `SELECT chat_name FROM CHAT_USER WHERE user_name = '${user_name}'; `
        

    await client.connect()
    const res = await client.query({ text:query})

    // this might be stupid since we might wanna await this 
    client.end()

    return res.rows;
}



export {getChatsFromUserDB};
