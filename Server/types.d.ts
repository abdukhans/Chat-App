import {Request,Response} from "express"
import { JwtPayload } from "jsonwebtoken"
import type {RawData} from 'ws'
interface SavedUser{
  name: string,
  hashedPass: string
}


interface UserData{
  user_name?: string,
  password? : string
}

interface IncomingUser  {
   name: string,
   password: string,
} 



interface UserRequest extends Request{
  user?: IncomingUser,
  name?: any
}


interface UserResponse extends Response{

}

interface MSGData {
  msg:string,
  user_name:string,
  chat_name:string
}

interface JoinChatReq{  
  user_name?:string,
  chat_name?:string
}





interface GetChatsFromUserRequest{
    user_name ?: string
}

export {SavedUser, 
  UserRequest,
  MSGData , 
  IncomingUser,
  JoinChatReq,
  GetChatsFromUserRequest,
  UserResponse,
  UserData}