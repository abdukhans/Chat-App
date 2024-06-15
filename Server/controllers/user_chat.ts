import {Request} from "express"
import {CreateChatRequest} from "./types"
import type { GetChatsFromUserRequest, IncomingUser, UserRequest, UserResponse } from "../types"

import {getChatsFromUserDB} from '../DB'


export const getChatsFromUser  = async (req:UserRequest,res:UserResponse):Promise<UserResponse> =>{
     
    
    const user = req.user;

    try{



        const resDB = await getChatsFromUserDB(user.name);



        return res.status(200).json({chats:resDB})
    } catch(error){





        return res.status(500).json({msg:error})
    }



}


