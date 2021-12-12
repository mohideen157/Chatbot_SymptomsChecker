const
{
   createpool 
} = require('mysql');


const pool = createpool({
    host: "localhost",
    user: "root",
    password: "",
    database: "symptoms_checker",
    connectionLimit: 100000
})