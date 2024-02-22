const form = document.getElementById("UserInfo");
const UserName = document.getElementById('UserName');
const Password = document.getElementById('Password');




async function GetJWT(e) {
    e.preventDefault();

    const userName = UserName.value;
    const password  = Password.value;


    const Token = "asfadsf"


    const response = await fetch("http://localhost:3000/api/users/login",
        {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${Token}`
            },
            body:{
                name: userName,
                password: password,
            }
            
        }
    )
        

  
    const res = await response.json();
  




    if (!res.success) {
        console.log(res.message);
    }else{
        localStorage.setItem('TOKEN',res.access_token) 
    }




        


}

form.onsubmit = (e) =>  GetJWT(e)



