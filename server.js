const express = require('express');
const cors = require('cors');
const nodemailer = require('./nodemailer')
const {sql ,Connect} = require('./mssql')
require('dotenv').config()
const nodecron = require('node-cron')

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => {
    res.json({
        msg: 'This is a express api for testing purposes only ',
        status: 200
    }).status(200)
})

app.get('/get', (req, res) => {
    res.json({
        msg: 'This is a express api for testing purposes only ',
        status: 200
    }).status(200)
})

app.post('/', (req, res) => {
    res.json({ msg: ' There is nothing that post route' }).status(200)
})

app.delete('/', (req, res) => {
    res.json({ msg: ' There is nothing that delete route' }).status(200)
})

app.put('/', (req, res) => {
    res.json({ msg: ' There is nothing that put route' }).status(200)
})

app.post('/portfolio/contactform', (req, res) => {

    const {name , email, msg}=req.body

    const msgtext = {
        from: process.env.Email_id,
        to: '21pa1a0269@vishnu.edu.in',
        subject: 'Got a new mail from Portfolio',
        html :`<h3>We got the Data from your Webpage</h3> 
        <p style = 'color: white'> Data submited by the ${name}</p> 
        <h3 style = 'color: white'> Name : ${name} </h3> 
        <h3 style = 'color: white'> Email : ${email} </p></h3>  
        <h3 style = 'color: white'> Suggestion : ${msg} </p></h3>  

        <p>Thanking you, </p> 
        <p>Yours Lovingly</p>
        `
    };

        async function Sendmail(){
            const transport = await nodemailer.connect()

        transport.sendMail(msgtext, (err, info) => {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Email sent successfully:', info.response);
                res.json({msg:'Email sent to Target Mail', status:200})
            }
        });
        }

    Sendmail()
})

app.post('/remainder/setremainder', async (req,res)=>{
    const {remainder, link} = req.body
    const pool= await Connect()
    const response = await pool.request()
    .input('remainder' , remainder)
    .input('link', link)
    .query('INSERT INTO Remainders(Activity, Link) VALUES(@remainder, @link)',(err,res)=>{
        if(err) console.log(err)
        return 'Success'
    })
})

var remainderList = []
app.get('/remainder/setremainder',async (req,res)=>{
    const pool= await Connect()
    const response = await pool.request().query('select * from Remainders')
    const data = response.recordset
    remainderList = data
    res.json(data)
})

app.delete('/remainder/setremainder/:remainder',async (req,res)=>{
    const remainder = req.params.remainder
    const pool= await Connect()
    await pool.request()
    .input('remainder' , remainder)
    .query('DELETE FROM Remainders where Activity=@remainder',(err,res)=>{
        if(err) console.log(err)
        return 'Success'
    })
})

// nodecron.schedule('30 12 * * *', () => {
app.get('/getsms', async(req,res)=>{

    const pool= await Connect()
    const response = await pool.request().query('select * from Remainders')
    const data = response.recordset
    remainderList = data
    console.log(data)

  const tableitems = remainderList.map((el, index) => {
  return `
    <tr style="padding:10px;border-bottom:1px solid #eee;">
        <td>${index + 1}</td>
        <td>${el.Activity}</td>
    </tr>
  `;
}).join(""); 



  const msgtext = {
        from: process.env.Email_id,
        to: 'ppvarmajobs@gmail.com',
        subject: 'Un-completed tasks in today',
        html :`<h4>These are the tasks you have to completed before going to sleep</h4>

        <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;width:100vw;">
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;">
      <tr>
        <th>#</th>
        <th>Task</th>
      </tr>

      ${tableitems}
    </table>
    </div>
        `
    };

        async function Sendmail(){
            const transport = await nodemailer.connect()

        transport.sendMail(msgtext, (err, info) => {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Email sent successfully:', info.response);
                res.json({msg:'Email sent to Target Mail', status:200})
            }
        });
        }

        Sendmail()
    });


app.listen(5005, () => {
    console.log('Server started running at port 5005');
});
