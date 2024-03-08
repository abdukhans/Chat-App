
const socket = new WebSocket(`ws://localhost:3000/?clientId=${localStorage.getItem('TOKEN')}`)



console.log(localStorage.getItem('TOKEN'));

function SendMsg(e) {
    e.preventDefault();


    const input = document.querySelector('input')

    if (input.value) {
        
        socket.send(input.value)
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
