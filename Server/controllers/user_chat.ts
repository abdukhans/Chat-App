import {Request} from "express"
import {CreateChatRequest} from "./types"
import type { GetChatsFromUserRequest, IncomingUser, UserRequest, UserResponse } from "../types"

import {getChatsFromUserDB,getMsgsFromChatDB} from '../DB'


export const getChatsFromUser  = async (req:UserRequest,res:UserResponse):Promise<UserResponse> =>{
     
    
    const user = req.user;

    try{



        const resDB = await getChatsFromUserDB(user.name);



        return res.status(200).json({chats:resDB})
    } catch(error){





        return res.status(500).json({msg:error})
    }



}


export const getMsgsFromChat =async (req:UserRequest, res:UserResponse): Promise<UserResponse> => {
    const user = req.user;
    const body = req.body;
    try{
        const resDB = await getMsgsFromChatDB(user.name, body.chat_name);
        return res.status(200).json({msgs:resDB})
    } catch(error){
        return res.status(500).json({msg:error})
    }

    
}