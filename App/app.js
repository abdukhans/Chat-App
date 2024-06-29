const user_name = localStorage.getItem('USER_NAME')
const Token     = localStorage.getItem('TOKEN')
var curGroup    = ''

const socket = new WebSocket(`ws://localhost:3000/?clientId=${localStorage.getItem('TOKEN')}`)

console.log(user_name.toString());

async function getMsgs(params) {
    
}
async function  getGroups() {

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


    console.log(resJ.chats);


    curGroup = resJ.chats[0].chat_name;

    console.log('curGrpp ' , curGroup);
   
    resJ.chats.map((group_name)=>{

        const groupEl = document.createElement('div');

        groupEl.classList.add('GroupRes')

        groupEl.innerText = group_name.chat_name

        GCResultsEl.appendChild(groupEl);


    })

}





async function Init(){
    await getGroups();

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

    const data = {msg:input.value,user_name:user_name,chat_name:"TestChatUI"}



    if (input.value) {

        console.log(JSON.stringify(data));
        
        socket.send(JSON.stringify(data))
        input.value = ''
    }
    input.focus()    
}


document.querySelector('form').addEventListener("submit", SendMsg)
document.querySelector('button').addEventListener("click", SendMsg)



socket.addEventListener("message", ({ data }) => {
   const msg_cont = document.querySelector('.message-container')

    console.log(msg_cont);


   const msg_element = document.createElement('div')

    //  <div class="message receiver-message">
    //                             <img src="https://media.geeksforgeeks.org/wp-content/uploads/20210511160813/g4g.jpg" alt="Receiver Avatar"
    //                                 class="avatar">
    //                             Sure, feel free to ask!
    //                         </div>

   const reciver_or_sender = false ? 'sender': 'receiver'
   msg_element.classList.add(`message`)
   msg_element.classList.add( `${reciver_or_sender}-message`)
   

   const img_element = document.createElement('img')

   const src = "https://media.geeksforgeeks.org/wp-content/uploads/20210511160813/g4g.jpg"
   img_element.src = src;
   img_element.alt = reciver_or_sender;
   img_element.classList.add('avatar');

   


   msg_element.appendChild(img_element)
   const  text = document.createTextNode(data);
   msg_element.appendChild(text);




    msg_cont.appendChild(msg_element)

    // const el = document.getElementsByTagName( `li`)

    // el[0].textContent="NOOOOOOOOOOOOOO!"
})



Init();