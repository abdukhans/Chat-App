const http = require('http')
const ws = require('ws')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const {save} = require('./DB/save')
const {getUserByName} = require('./DB/getUser')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { Pool, Client } = require('pg');
const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
})


users = []
app.use(express.json())



function authenticate(req,res,next) {

  console.log("authenticating");


  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.send(401);
  jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{

    if (err) {
      return res.send()
    }


    req.user = user

  })


  
  next();
}
app.use('/auth',authenticate);



app.post('/api/users/signUp', async (req,res)=>{

  try {
    const user = {name:req.body.name , hashedPass : req.body.password }
    const password = req.body.password
    const hashedPass = await bcrypt.hash(password,10);
    const seqUser = {name: req.body.name, hashedPass: hashedPass}


    await save(seqUser)
    res.status(201).send()
    
  } catch (error) {
    console.log(error);
    res.status(500).send()
  }
 


})

app.post('/api/users/login',async (req,res,next)=>{


  const user = req.body;


  hashed_pass = await getUserByName(user.name)


  //console.log(hashed_pass);




  bcrypt.compare(user.password, hashed_pass, function(err, res_) {


  //console.log(res_);

 
  if (err){
    // console.log("err:" ,err);
    // console.log("rr");
    return res.status(500).json({success: false, message: 'something went wrong when comparing passwords'}); 
  }
  if (res_) {
    // Send JWT 
    const token  = jwt.sign(user,process.env.SECRET_KEY)
    return res.status(201).json({success: true, access_token:token})
  } else {
    // response is OutgoingMessage object that server response http request
    return res.status(401).json({success: false, message: 'passwords do not match'});
  }
});



})



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

const wsServer = new ws.Server({noServer:true, clientTracking:true})
const msgs = ["m1","m2"]
const sockets = []
const mapIdSocks = {}
wsServer.on('connection', async (socket,req)=>{

    
    const params = new URLSearchParams(req.url)


    
    //console.log(socket);
    //console.log(socket);
    

    mapIdSocks[params.get('/?clientID')] = socket

    socket.clientId = params.get('/?clientID')


    sockets.push(socket);
//    await getPostgresVersion()


    msgs.forEach((msg)=> socket.send(`${msg}`))
           

    


    //console.log(server.clients)
    socket.on('message', message =>{

        //console.log(message);

        //console.log(server.clients);

        msgs.push(message)
        socket.send(`${message}`)

        sockets.forEach((socket_v)=>{
          if (socket_v != socket) {
            console.log(socket.clientId);
            socket_v.send(`${message}`)
          }
            
        })
        // server.clients.forEach((socket)=>{

        //     socket.send(`${message}`)



        // })

        console.log(msgs);
        
        //key.send(`${message}`)
        
        // console.log('MSG: ',b.toString());
        // socket.send(`${message}`)
    })
})

// socket.addEventListener("message", ({ data }) => {
//     const li = document.createElement('li')
//     li.textContent = data
//     document.querySelector('ul').appendChild(li)
// })


wsServer.on('close', async (socket)=>{

  console.log(socket.clientId); 
  
})


const server = app.listen(3000)




console.log(server.address())
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    console.log("Upgrading to websocket");
    wsServer.emit('connection', socket, request);
  });
});

