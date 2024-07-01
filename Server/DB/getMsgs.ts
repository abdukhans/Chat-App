import {config} from "dotenv"

config()
import  { Pool, Client, Query } from 'pg'


const getMsgsFromChatDB = async  (user_name:string,chat_name:string): Promise<any[]> =>{

    
    const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
    })


    



    //const InsertToChats = `INSERT INTO CHATS VALUES ('${chat_name}','${user_name}'); `
    
    //const InsertToChatUser = `INSERT INTO CHAT_USER (chat_name,user_name) VALUES ('${chat_name}','${user_name}');`


    console.log("USER:  ", user_name);
    
    const query = `SELECT msg, user_name FROM msgs WHERE chat_name = '${chat_name}' AND  exists (SELECT * FROM chat_user WHERE chat_name = '${chat_name}' and user_name = '${user_name}'); `
    
    //select msg from msgs where chat_name = 'TestChatUI';

    // select msg from msgs where chat_name = 'TestChatUI' AND exists (select * from chat_user where user_name = 'Abdu123' AND chat_name = 'TestChatUI');
        

    await client.connect()








    const res = await client.query({text:  query })

    // this might be stupid since we might wanna await this 
    client.end()

    return res.rows;
}



export {getMsgsFromChatDB};



