import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {UserRequest,MSGData} from "./types"
import   WebSocket, {RawData, Server}   from 'ws'
import {IncomingMessage} from "http"


console.log('asdf');

function authWebSocket(req:IncomingMessage): Boolean {
  

  const params = new URLSearchParams(req.url);

  const token  = params.get('/?clientId');


  console.log("TOKEN :" , token.toLocaleLowerCase());

  if (token==='null') {
    
    return false;
  }



 

  try {
    jwt.verify(token,process.env.SECRET_KEY)
    
    return true

  } catch (error) {
    
    return false
  }
  

  
}



const wsServer:WebSocket.Server = new WebSocket.Server({noServer:true, clientTracking:true})
const msgs    :String[] = []




const sockets :WebSocket[]= []


const mapIdSocks = {}




wsServer.on('connection', async (socket,req)=>{

    
    const params = new URLSearchParams(req.url)


    
    //console.log(socket);
    //console.log(socket);
    

    

    mapIdSocks[params.get('/?clientID')] = socket

    // socket = params.get('/?clientID')


    sockets.push(socket);
//    await getPostgresVersion()


    msgs.forEach((msg)=> socket.send(`${msg}`))
           

    


    //console.log(server.clients)
    socket.on('message', message  =>{

       console.log("string: ", message.toString());

        const user = JSON.parse(message.toString())

        console.log("OBJ: ",user);
        

        const msg = user.msg
        //console.log(server.clients);

        msgs.push(msg)
        socket.send(`${msg}`)

        sockets.forEach((socket_v)=>{
          if (socket_v != socket){ 
            // console.log(socket.clientId);
            socket_v.send(`${msg}`)
          }
            
        })
        

        console.log(msgs);
        

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
    const authed = authWebSocket(request)


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

