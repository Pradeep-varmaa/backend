const express = require("express");
const cors = require("cors");
const nodecron = require("node-cron");
const mailsend = require("./runJob.js");
const { sql, Connect } = require("./mssql");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { 
    res.json({ msg: 'This is a express api for testing purposes only ', status: 200 }).status(200) 
}) 
app.post('/', (req, res) => {
    res.json({ msg: ' There is nothing that post route' }).status(200) 
})

app.delete('/', (req, res) => {
    res.json({ msg: ' There is nothing that delete route' }).status(200) 
})

app.post("/remainder/setremainder", async (req, res) => {
    const { remainder, link } = req.body;
    const pool = await Connect();
    await pool
        .request()
        .input("remainder", sql.VarChar, remainder)
        .input("link", sql.VarChar, link)
        .query("INSERT INTO Remainders (Activity, Link) VALUES (@remainder, @link)");

    res.json({ msg: "Task Saved", status: 200 });
});

app.get("/remainder/getremainder", async (req, res) => {
    const pool = await Connect();
    const result = await pool.request().query("SELECT * FROM Remainders");
    res.json(result.recordset);
});

nodecron.schedule(
    "52 16 * * *",
    () => {
        console.log("Running 7 PM IST Cron Job...");
        mailsend();
    },
    { timezone: "Asia/Kolkata" }
);

app.listen(5005, () => {
    console.log("Server running at http://localhost:5005");
});
