const user_name = localStorage.getItem('USER_NAME')
const Token     = localStorage.getItem('TOKEN')
var curGroup    = ''
const receiverJPG = "https://media.geeksforgeeks.org/wp-content/uploads/20210511160813/g4g.jpg"
const senderJPG   = "https://media.geeksforgeeks.org/wp-content/uploads/20220123013311/gfg.png"
const socket = new WebSocket(`ws://localhost:3000/?clientId=${localStorage.getItem('TOKEN')}`)
const msgBoard = document.querySelector('.message-container')
const dispGCName = document.querySelector('.DisplayGCName')
const logOut   = document.querySelector('#LogOut')

logOut.addEventListener('click',LogOut)

console.log(msgBoard);
console.log(user_name.toString());


function LogOut(){
    localStorage.removeItem("USER_NAME");
    localStorage.removeItem("TOKEN");

    location.replace('index.html')
}


async function getMsgs() {


    const chat_name = JSON.stringify({chat_name:curGroup})

    console.log(chat_name);
    const res = await fetch("http://localhost:3000/api/v1/users/getMsgsFromChat",
        {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${Token}`,
                "Content-Type": "application/json"
            },
            body: chat_name
        })

    const resJ = await res.json();


    const lst_msg = resJ.msgs


    console.log(lst_msg[0]);

    msgBoard.innerHTML = ''


    lst_msg.map(({msg, user_name: user_name_msg })=>{
      

        const msgEl = document.createElement('div');

        const img = document.createElement('img');


        // console.log(user_name , user_name_msg);

        img.src =  (user_name === user_name_msg ) ? receiverJPG : senderJPG;
        img.classList.add('avatar')


        const sendOrReceive = (user_name === user_name_msg ) ? "receiver" : "sender";

        const name = `${sendOrReceive}-message`;
        msgEl.classList.add('message')
        msgEl.classList.add(name)

        msgEl.appendChild(img);


        const p = document.createElement('p');

        p.innerText = msg;
        msgEl.appendChild(p);

        msgBoard.prepend(msgEl);

    })


    
}


function outLineGroups(el){

    const groups = document.querySelectorAll(".GroupRes")


    console.log(groups);




    groups.forEach((v)=>{

      
        
        const g_name = v.innerHTML


        v.classList.remove('Active')
            
    


    })

    el.classList.add('Active')

}

async function changeGroup (ev){


    curGroup =  this.innerText;

    outLineGroups(this);

    dispGCName.innerText = curGroup;


    await getMsgs();
    




} 
async function  getGroups(isInit=false) {

    const res = await fetch("http://localhost:3000/api/v1/users/getChatsFromUser",
        {
            method: "GET",
            headers:{
                "Authorization": `Bearer ${Token}`,
                "Content-Type": "application/json"
            }
           
            
        })

    const resJ = await res.json();
    


    const GCResultsEl = document.querySelector('.GCResults')
    // GCResultsEl.innerHTML =''


    console.log(resJ.chats);

    

    
    curGroup = resJ.chats[0].chat_name;

    dispGCName.innerText = curGroup;
    //console.log('curGrpp ' , curGroup);
    
   
    resJ.chats.map((group_name)=>{



        const groupEl = document.createElement('div');


        groupEl.classList.remove('Active')
        if (group_name.chat_name === curGroup) {
            groupEl.classList.add('Active')

        }

        groupEl.classList.add('GroupRes')


        groupEl.innerText = group_name.chat_name


        groupEl.addEventListener('click',changeGroup) 

        GCResultsEl.appendChild(groupEl);


    })

}





async function Init(){
    await getGroups(true);

    await getMsgs();

    

}



console.log(localStorage.getItem('TOKEN'));

function SendMsg(e) {
    // if(socket.readyState !== socket.OPEN)
    //     socket = new WebSocket(`ws://localhost:3000/?clientId=${localStorage.getItem('TOKEN')}`)
    // {
    // }
    console.log(":w");
    e.preventDefault();


   
    const input = document.querySelector('#MSGTYPE > input[type=text]')


    console.log(input);

    const data = {msg:input.value,user_name:user_name,chat_name:curGroup}



    if (input.value) {

        console.log(JSON.stringify(data));
        
        socket.send(JSON.stringify(data));


        input.value = ''
    }
    input.focus()    
}


document.querySelector('form').addEventListener("submit", SendMsg)
document.querySelector('.message').addEventListener("click", SendMsg)



socket.addEventListener("message", ({ data }) => {


    console.log(data);

    const {msg,user_name:user_name_msg,chat_name}= JSON.parse(data) 


    if(chat_name !== curGroup){
        
        return
    }

    console.log(msg,user_name);

   const msg_cont = document.querySelector('.message-container')

    console.log(msg_cont);


   const msg_element = document.createElement('div')

    
   
   //  <div class="message receiver-message">
    //                             <img src="https://media.geeksforgeeks.org/wp-content/uploads/20210511160813/g4g.jpg" alt="Receiver Avatar"
    //                                 class="avatar">
    //                             Sure, feel free to ask!
    //                         </div>



   const reciver_or_sender = user_name_msg === user_name ? 'receiver': 'sender'
   msg_element.classList.add(`message`)
   msg_element.classList.add( `${reciver_or_sender}-message`)
   

   const img_element = document.createElement('img')

   const src = (user_name_msg === user_name) ? receiverJPG : senderJPG;
   img_element.src = src;
   img_element.alt = reciver_or_sender;
   img_element.classList.add('avatar');

   


   msg_element.appendChild(img_element)
   const  text = document.createTextNode(msg);
   msg_element.appendChild(text);




    msg_cont.prepend(msg_element)

    // const el = document.getElementsByTagName( `li`)

    // el[0].textContent="NOOOOOOOOOOOOOO!"
})



Init();