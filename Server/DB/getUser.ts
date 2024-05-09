require('dotenv').config()
// const { Pool, Client } = require('pg')

import {Pool,Client} from 'pg'




async function getUserByName(user_u_name){


    const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
    })


    //const {name,hashedPass} = user
    await client.connect()


    // console.log(name);
    // console.log(hashedPass)
    const query = `SELECT * FROM users WHERE u_name='${user_u_name}';`
    //console.log(query);
    const res = await client.query({ text:query})





    


    await client.end()
    //console.log("client is closed");

    //console.log("Res:",res);


    if (res.rows.length > 0) {
        
    

        return res.rows[0].hash_pass;
    }
}


export  {getUserByName}