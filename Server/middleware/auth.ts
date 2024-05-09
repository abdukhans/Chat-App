import jwt, { JwtPayload } from "jsonwebtoken"
import {Request,Response} from 'express'
import {UserRequest,SavedUser} from "../types"
import {} from "jsonwebtoken"
import {IncomingUser} from '../types'



function getIncommingUser (payload: JwtPayload | string):IncomingUser {
  if ((payload as string).anchor !== undefined ) {
  

    const name:string = payload['name']
    const password:string = payload['password']


    return {name:name,password:password};
  }



  throw new Error("Payload is not JwtPayload")


 


  
}





const authenticate = async (req:UserRequest,res:Response,next) =>{
  console.log('RUNING AUTH');
  
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  console.log("TOKEn:",token);
  

  if (token === 'null'){ 
    console.log('asdf');
    
    return res.send(401);
  }

  try{
   
    const payload =   jwt.verify(token,process.env.SECRET_KEY) as JwtPayload;


    const IncomingUser = getIncommingUser(payload);





    

    // console.log("Payload: ", payload );
    




    req.user = IncomingUser






    next();


  }catch(err){

    console.log("Something went wrong");
    

  }
 
    
    
    

    


  
  
}
export default authenticate