import {Request} from "express"
import { JwtPayload } from "jsonwebtoken"
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

export {SavedUser, UserRequest, IncomingUser}