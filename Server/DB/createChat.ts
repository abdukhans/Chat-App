
import {config} from "dotenv"


config()
import  { Pool, Client } from 'pg'



const createNewChatDB = async  (chat_name:string,user_name:string): Promise<void> =>{

    
    const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
    })


    await client.connect()



    const query = `INSERT INTO CHATS VALUES ('${chat_name}','${user_name}');`
    

        
    const res = await client.query({ text:query})
    
        
   
     

        
    
    await client.end()





}



export {createNewChatDB};
