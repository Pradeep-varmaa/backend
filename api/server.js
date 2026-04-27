const express = require("express");
const cors = require("cors");
const nodecron = require("node-cron");
const mailsend = require("./runJob.js");
const { sql, Connect } = require("./mssql");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Root routes
app.get('/', (req, res) => { 
    res.status(200).json({ 
        msg: 'This is a express api for testing purposes only', 
        status: 200 
    });
});

app.post('/', (req, res) => {
    res.status(200).json({ 
        msg: 'There is nothing in POST route' 
    });
});

app.delete('/', (req, res) => {
    res.status(200).json({ 
        msg: 'There is nothing in DELETE route' 
    });
});

// Save reminder
app.post("/remainder/setremainder", async (req, res) => {
    try {
        const { remainder, link } = req.body;

        const pool = await Connect();

        await pool.request()
            .input("remainder", sql.VarChar, remainder)
            .input("link", sql.VarChar, link)
            .query("INSERT INTO Remainders (Activity, Link) VALUES (@remainder, @link)");

        res.status(200).json({ msg: "Task Saved" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error saving task" });
    }
});

// Get reminders
app.get("/remainder/getremainder", async (req, res) => {
    try {
        const pool = await Connect();
        const result = await pool.request().query("SELECT * FROM Remainders");

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching data" });
    }
});

// ✅ Get IP route (FIXED)
app.get('/getip', (req, res) => {

    let ip =
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.socket.remoteAddress ||
        "Unknown";

    // Clean IPv6 prefix
    if (ip && ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    }

    res.status(200).json({ IP_ADDRESS: ip });
});

// Cron job
nodecron.schedule(
    "52 16 * * *",
    () => {
        console.log("Running 7 PM IST Cron Job...");
        mailsend();
    },
    { timezone: "Asia/Kolkata" }
);

// Server
app.listen(5005, () => {
    console.log("Server running at http://localhost:5005");
});
