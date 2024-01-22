const ws = require('ws')
const server = new ws.Server({port:3000, clientTracking:true})
const msgs = []
server.on('connection',socket=>{

    //console.log(socket);
    

  
    //msgs.forEach((msg)=> socket.send(`${msg}`))
           

    
        

    //console.log(server.clients)
    socket.on('message', message =>{

        //console.log(message);

        //console.log(server.clients);

        msgs.push(message)

        server.clients.forEach((socket)=>{

            socket.send(`${message}`)



        })

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