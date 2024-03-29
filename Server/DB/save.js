require('dotenv').config()
const { Pool, Client } = require('pg')


async function save(user){


    const client = new Client({
    connectionString:process.env.DATABASE_URL_CLIENT
    })


    const {name,hashedPass} = user
    await client.connect()


    console.log(name);
    console.log(hashedPass)
    const query = `INSERT INTO users VALUES ('${name}','${hashedPass}');`
    console.log(query);
    await client.query(query)


    await client.end()
    console.log("client is closed");

}


module.exports = {save}