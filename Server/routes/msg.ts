import {createChat} from '../controllers/msg'
import {Router} from "express"

const MsgRouter = Router();

MsgRouter.post('/createChat' , createChat)







export {MsgRouter}