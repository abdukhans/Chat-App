
const user_name = localStorage.getItem['USER_NAME']
const socket = new WebSocket(`ws://localhost:3000/?clientId=${localStorage.getItem('TOKEN')}`)



console.log(localStorage.getItem('TOKEN'));

function SendMsg(e) {
    e.preventDefault();



    const input = document.querySelector('input')


    const data = {msg:input.value,name:user_name,chat_name:"N/A"}



    if (input.value) {

        console.log(JSON.stringify(data));
        
        socket.send(JSON.stringify(data))
        input.value = ''
    }
    input.focus()    
}


document.querySelector('form').addEventListener("submit", SendMsg)



socket.addEventListener("message", ({ data }) => {
    const li = document.createElement('li')

    li.classList.add("MsgBox")

    li.textContent = data;






    document.querySelector('ul').appendChild(li)


    // const el = document.getElementsByTagName( `li`)

    // el[0].textContent="NOOOOOOOOOOOOOO!"
})
