const sql = require('mssql');

const config = {
    user : 'sa',
    password :'1234',
    server : 'VARMAA',
    database : 'UserCred',
    options:{
        encrypt:true,
        trustServerCertificate: true,
    }
}
async function Connect() {
    try {
        const pool = await sql.connect(config);
        console.log("connected");
        return pool;  
    } catch (err) {
        console.log(err);
        throw err;
    }
}



module.exports =  { Connect };

