import   WebSocket, {RawData, Server}   from 'ws'
import {IncomingMessage} from "http"
import express, {Request,Response} from 'express'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {UserRequest} from "./types"
const app     = express()
const {save}  = require('./DB/save')
const {getUserByName} = require('./DB/getUser')
import {authenticate as authMiddleware} from "./middleware/auth"
import {authRouter} from './routes/auth'
import {MsgRouter} from './routes/msg'

import cors from 'cors'






app.use(cors())

app.use(express.json())


require('dotenv').config()

const { Pool, Client } = require('pg');
const { log } = require('console');
const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
})



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



// This will handle login and sign up, by given users access token
app.use('/api/v1/auth',authRouter);


// Once the user is logged in they will have to be authenticated by  "authMiddleware"
// which will just check to see if the header has a valid Bearer token. 
// If it does then "MsgRouter" will take control and will handle all App logic 
// NOTE: that that the "MsgRouter" will not handle the webSocket stuff, just the things
// needed before webSocket will take over logic 
app.use('/api/v1/users', authMiddleware , MsgRouter );




//CreateTable()
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_POOL,
  ssl: {
    require: true,
  },
});

async function getPostgresVersion() {
  const client = await pool.connect();
  try {
    const response = await client.query('SELECT version()');
    console.log(response.rows[0]);
  } finally {
    client.release();
  }
}


getPostgresVersion();



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
    socket.on('message', message =>{

        //console.log(message);

        //console.log(server.clients);

        msgs.push(message.toString())
        socket.send(`${message}`)

        sockets.forEach((socket_v)=>{
          if (socket_v != socket){ 
            // console.log(socket.clientId);
            socket_v.send(`${message}`)
          }
            
        })
        

        console.log(msgs);
        

    })
})



wsServer.on('close', async (socket)=>{

  console.log(socket.clientId); 
  
})


const server = app.listen(3000)


console.log(server.address())

server.on('upgrade', (request, socket, head) => {

  console.log("REQ: ", request.url);
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
});


export function main():Number{


    return 0;
}