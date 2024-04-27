import {Request} from "express"
interface SavedUser{
  name: string,
  hashedPass: string
}

interface User extends Request{
  user?: SavedUser,
  name?: any
}

export {SavedUser, User}