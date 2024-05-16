if (localStorage.getItem('TOKEN')){
    location.replace('MSG.html')


}
const form = document.getElementById("UserInfo");
const UserName = document.getElementById('UserName');
const Password = document.getElementById('Password');





async function GetJWT(e) {
    e.preventDefault();

    const userName = UserName.value;
    const password  = Password.value;


    const Token = "asfadsf"

    const user = { name: userName,
                password: password}


    console.log("USER :" , user);

    const response = await fetch("http://localhost:3000/api/v1/auth/login",
        {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${Token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
            
        }
    )
        

  
    const res = await response.json();
  




    if (!res.success) {
        console.log(res.message);
    }else{
        localStorage.setItem('TOKEN',res.access_token) 
        localStorage.setItem('USER', res.user)
        location.replace("MSG.html")
    }







        


}

form.onsubmit = (e) =>  GetJWT(e)



