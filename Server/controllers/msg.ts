import {Request} from "express"
import {CreateChatRequest} from "./types"
import type { UserRequest } from "../types"

import {createNewChatDB} from '../DB'
const createChat  = async (req:UserRequest,res):Promise<void> =>{
    // console.log('Runnign crreate');
    
    const {chat_name} = req.body as CreateChatRequest

    const {name : user_name} = req.user

    try {
        await createNewChatDB(chat_name,user_name);
        return res.status(201).json({success: true, message: 'chat created'});

      
    } catch (error) {
        return res.status(501).json({success: false, message: 'DB error could not create chat'});    
    }
    
}




export {createChat}