const http = require('http')
const ws = require('ws')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
require('dotenv').config()

const { Pool } = require('pg');

app.use(express.json())


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





server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

