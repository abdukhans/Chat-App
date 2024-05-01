import {login,signUp} from '../controllers/auth'
import {Router} from "express"

const authRouter = Router();

authRouter.post('/login' , login)
authRouter.post('/signUp', signUp)



export {authRouter}