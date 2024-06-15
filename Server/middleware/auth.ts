import jwt, { JwtPayload } from "jsonwebtoken"
import {Request,Response} from 'express'
import {UserRequest,UserData} from "../types"
import {} from "jsonwebtoken"
import {IncomingUser} from '../types'



function getIncommingUser (payload: JwtPayload):IncomingUser {

    console.log(payload);

    const name:string = payload['name']
    const password:string = payload['password']

    

    return {name:name,password:password};
  



 

 


  
}





const authenticate = async (req:UserRequest,res:Response,next) =>{
  console.log('RUNING AUTH');
  
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  console.log("TOKEn:",token);


  

  

  // const IncomingUser  = req.user as IncomingUser ;


  //   const user_req = req.body as GetChatsFromUserRequest;
  //   const user_name = user_req.user_name;


  //   if (IncomingUser.name !== user_name ) {

  //       return res.status(401).json({msg:'The authenticated user name and supplied user name are not the same'})
        
  //   }
  

  if (token === 'null'){ 
    console.log('asdf');
    
    return res.send(401);
  }

  try{
   
    const payload =   jwt.verify(token,process.env.SECRET_KEY) as JwtPayload;

    const user = req.body as  UserData
    const user_name = user.user_name;


    
    

    const IncomingUser = getIncommingUser(payload);

    if (IncomingUser.name !== user_name && user_name !== undefined ) {

        return res.status(401).json({msg:'The authenticated user name and supplied user name are not the same'})
        
    }
  

    req.user = IncomingUser
    console.log("Payload: ", payload );

    next();


  }catch(err){

    // console.log("Something went wrong");
   

    console.log(err);
    
    
    return res.status(401).json({msg: 'Invalid TOKEN'})

  }
 
    
    
    

    


  
  
}
export {authenticate}