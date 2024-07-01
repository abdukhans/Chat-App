import {createChat,joinChat} from '../controllers/msg'
import {getChatsFromUser,getMsgsFromChat} from '../controllers/user_chat'

import {Router} from "express"

const MsgRouter = Router();

MsgRouter.post('/createChat' , createChat)
MsgRouter.post('/joinChat', joinChat )
MsgRouter.get('/getChatsFromUser', getChatsFromUser )
MsgRouter.get('/getMsgsFromChat',getMsgsFromChat)




export {MsgRouter}