const http = require('http')
const ws = require('ws')
const express = require('express')
const app = express()
// const expressWs = require('express-ws')(app)
const bcrypt = require('bcrypt');
const {save} = require('./DB/save')
const {getUserByName} = require('./DB/getUser')
const authMiddleware = require("./middleware/auth")
const jwt = require('jsonwebtoken')
const cors = require('cors');


app.use(cors())

app.use(express.json())



require('dotenv').config()

const { Pool, Client } = require('pg');
const { log } = require('console');
const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
})


users = []


function authenticate_(req,res,next) {

  console.log("authenticating");


  const authHeader = req.headers['Authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.send(401);
  jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{

    if (err) {

      return res.send(401)
    }


    req.user = user

  })


  
  next();
}

function authWebSocket(req) {
  

  const params = new URLSearchParams(req.url);

  const token  = params.get('/$clientID');

  if (token == null) return false;
    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
    if (err) {
      return false
    }
  })


  return true

}

//app.use('api/v1/auth',authRouter);
app.use('api/v1/auth',authMiddleware);
// app.use('/',authenticate_)
app.use('/api/users', async(req,res,next)=>{

  console.log("GETTING USER");

  console.log(req.body);

  req.num = 3;
  req.user = {name:req.body.name , hashedPass : req.body.password }

  next();

})


app.post('/api/users/signUp', async (req,res)=>{

  try {
    const user = req.user


    const password = user.hashedPass
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
      return res.status(201).json({success: true, access_token:token})
    
      
    });
   
  } catch (error) {
    console.log(error);
    res.status(500).send()
  }
 


})

app.post('/api/users/login',async (req,res,next)=>{

  const user = req.user;
  console.log(user);

  const hashed_pass = await getUserByName(user.name)


  //console.log(hashed_pass);

  if (hashed_pass) {
    

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
  }else{
    return res.status(401).json({success:false, message: 'User does not exist'})
  }


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

  console.log("REQ: ", request.url);
  wsServer.handleUpgrade(request, socket, head, socket => {
    console.log("Upgrading to websocket");

    const params = new URLSearchParams(request.url);
    const authed = authWebSocket(request)

    if (!authed) {
        // \r\n\r\n: These are control characters used in HTTP to
        // denote the end of the HTTP headers section.
        console.log("JWT FAILED")
        socket.close()
        return
    }
  
    wsServer.emit('connection', socket, request);
  });
});

