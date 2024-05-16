import {createChat,joinChat} from '../controllers/msg'
import {Router} from "express"

const MsgRouter = Router();

MsgRouter.post('/createChat' , createChat)
MsgRouter.post('/joinChat', joinChat )






export {MsgRouter}