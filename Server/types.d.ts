import {Request} from "express"
import { JwtPayload } from "jsonwebtoken"
import type {RawData} from 'ws'
interface SavedUser{
  name: string,
  hashedPass: string
}


interface IncomingUser  {
   name: string,
   password: string,
} 



interface UserRequest extends Request{
  user?: IncomingUser,
  name?: any
}


interface MSGData {
  msg:string,
  user_name:string,
  chat_name:string
}



export {SavedUser, UserRequest, MSGData , IncomingUser}