import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {UserRequest,MSGData, IncomingUser} from "./types"
import   WebSocket, {RawData, Server}   from 'ws'
import {IncomingMessage} from "http"
import {saveMsg,getUsersFromChat} from './DB'
import e from "express"



function authWebSocket(req:IncomingMessage, socket:WebSocket): Boolean {
  

  const params = new URLSearchParams(req.url);

  const token  = params.get('/?clientId');


  console.log("TOKEN :" , token.toLocaleLowerCase());

  if (token==='null') {
    
    return false;
  }



 

  try {
    //const paylod = JSON.parse( jwt.verify(token,process.env.SECRET_KEY)as string) as IncomingUser
    

    const payload = jwt.verify(token,process.env.SECRET_KEY) as IncomingUser

    console.log('PAY' , payload);
    

    mapIdSocks.set(payload.name, socket);

    console.log("mapIdSocks: ", mapIdSocks);
    
    return true

  } catch (error) {
    
    return false
  }
  

  
}



const wsServer:WebSocket.Server = new WebSocket.Server({noServer:true, clientTracking:true})
const msgs    :String[] = []




const sockets :WebSocket[]= []


const mapIdSocks = new Map<string,WebSocket>();  




wsServer.on('connection', async (socket,req)=>{

    
    const params = new URLSearchParams(req.url)


    const token = params.get('/?clientID');




    

    

    // mapIdSocks[params.get('/?clientID')] = socket

    // socket = params.get('/?clientID')




    // sockets.push(socket);
//    await getPostgresVersion()


    //msgs.forEach((msg)=> socket.send(`${msg}`))
           

   
  


    //console.log(server.clients)
    socket.on('message', async message  =>{


        

        //console.log("string: ", message.toString());

        const user = JSON.parse(message.toString()) as MSGData;

       // console.log("OBJ: ",user);
        

        const {msg,chat_name,user_name} = user


        //console.log("Chat_name: ", chat_name);


        //console.log("USER TO INSET: ", user_name);
        
        
        await saveMsg(msg,chat_name,user_name);
        //console.log(server.clients);


        const users_in_chat = await getUsersFromChat(chat_name);

        //  console.log("USERs IN CHAT: " ,users_in_chat);


        //console.log("USERS ONLINE = ", users_in_chat.keys());
      
      
       


        users_in_chat.forEach((user_name )=>{



          //console.log("TRYING TO SEND ", user_name.user_name);
          


          const socket = mapIdSocks.get(user_name.user_name)


          
            
          
          if (socket) {
            socket.send(msg)
            //console.log("SEND TO USER  ", user_name);

          }else{
            //console.log("USER : ", user_name, "is not online");

          }
            
        

          
        })

        //msgs.push(msg)




        //socket.send(`${msg}`)

        // sockets.forEach((socket_v)=>{
        //   if (socket_v != socket){ 
        //     // console.log(socket.clientId);
        //     socket_v.send(`${msg}`)
        //   }
            
        // })
        

        //console.log(msgs);
        

    })
})



wsServer.on('close', async (socket)=>{

  console.log(socket.clientId); 
  
})

const handleUpgrade  = (request, socket, head) =>{
wsServer.handleUpgrade(request, socket, head, socket => {
    console.log("Upgrading to websocket");

    //console.log(socket);

    const params = new URLSearchParams(request.url);
    const authed = authWebSocket(request,socket)


    console.log("authed: ",authed);
    if (!authed ) {
        // \r\n\r\n: These are control characters used in HTTP to
        // denote the end of the HTTP headers section.
        console.log("JWT FAILED" ,authed)
        socket.close()
        return
    }
  
    wsServer.emit('connection', socket, request);
  });

}
export {wsServer,handleUpgrade}

