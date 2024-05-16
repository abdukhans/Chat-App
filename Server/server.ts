import   WebSocket, {RawData, Server}   from 'ws'
import {IncomingMessage} from "http"
import express, {Request,Response} from 'express'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {UserRequest,MSGData} from "./types"
const app     = express()
const {save}  = require('./DB/save')
const {getUserByName} = require('./DB/getUser')
import {authenticate as authMiddleware} from "./middleware/auth"
import {authRouter} from './routes/auth'
import {MsgRouter} from './routes/msg'
import {wsServer,handleUpgrade}  from "./wsServer"

import cors from 'cors'






app.use(cors())

app.use(express.json())


require('dotenv').config()

const { Pool, Client } = require('pg');
const { log } = require('console');
const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
})



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

const server = app.listen(3000)



console.log(server.address())

server.on('upgrade', (request, socket, head) => {

  console.log("REQ: ", request.url);

  handleUpgrade(request,socket,head)

  
});
