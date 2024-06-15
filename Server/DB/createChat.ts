
import {config} from "dotenv"


config()
import  { Pool, Client } from 'pg'



const createNewChatDB = async  (chat_name:string,user_name:string): Promise<void> =>{

    
    const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
    })


  
        
    await client.connect()



    const InsertToChats = `INSERT INTO CHATS VALUES ('${chat_name}','${user_name}'); `
    
    const InsertToChatUser = `INSERT INTO CHAT_USER (chat_name,user_name) VALUES ('${chat_name}','${user_name}');`
        
    await client.query({ text:InsertToChats})
    
    await client.query({ text:InsertToChatUser})

    
    await client.end()


    
   
     

        
    





}



export {createNewChatDB};
