import bcrypt from "bcrypt"
import {Request} from "express"
import {IncomingUser} from "../types"
import jwt from "jsonwebtoken"

import {save,getUserByName} from '../DB'

const signUp = async (req:Request,res)=>{

  try {

    
    const user = req.body as IncomingUser


    const password = user.password
    await bcrypt.hash(password,10,async  function (err, hash) {


      if (err) {
        throw err;
      }

      //const hashedPass =3 ;
      // /console.log("U: ", user);
      const seqUser = {name: user.name, hashedPass: hash}

      await save(seqUser)
      const token  = jwt.sign(user,process.env.SECRET_KEY)
      //const token = 4
      return res.status(201).json({user:{name:user.name},success: true, access_token:token})
    
      
    });
   
  } catch (error) {
    console.log(error);
    res.status(500).send()
  }
 


}



const login  = async (req:Request,res,next)=>{

  const user = req.body as IncomingUser;
  console.log(user);

  const hashed_pass = await getUserByName(user.name)


  //console.log(hashed_pass);

  if (hashed_pass) {
    

    bcrypt.compare(user.password, hashed_pass, function(err, res_) {


    console.log("COMPARING : ", user.password, hashed_pass );


    //console.log(res_);

  
    if (err){
      // console.log("err:" ,err);
      // console.log("rr");
      return res.status(500).json({success: false, message: 'something went wrong when comparing passwords'}); 
    }
    if (res_) {
      // Send JWT 
      const token  = jwt.sign(user,process.env.SECRET_KEY)

      console.log("TOKEN: ", token)
      return res.status(201).json({user:{name:user.name},success: true, access_token:token})
    } else {
      // response is OutgoingMessage object that server response http request
      return res.status(401).json({success: false, message: 'passwords do not match'});
    }
  });
  }else{
    return res.status(401).json({success:false, message: 'User does not exist'})
  }


}


export {signUp,login};