const { Connect } = require("./mssql");
const { connectMail } = require("./nodemailer");

async function mailsend() {
    try {
        const pool = await Connect();
        const result = await pool.request().query("SELECT * FROM Remainders");

        const rows = result.recordset;

        const tableitems = rows
            .map(
                (el, index) => `
            <tr style = " text-align:center;">
                <td>${index + 1}</td>
                <td>${el.Activity}</td>
            </tr>`
            )
            .join("");

        const transport = await connectMail();

        const msgtext = {
            from: process.env.Email_id,
            to: "ppvarmajobs@gmail.com",
            subject: "Un-completed tasks today",
            html: `
            <h4>Tasks you must complete before sleeping</h4>
            <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%;">
                <tr><th>#</th><th>Task</th></tr>
                ${tableitems}
            </table>
        `,
        };

        const info = await transport.sendMail(msgtext);
        console.log("Daily Email Sent:", info.response);
    } catch (err) {
        console.error("mailsend() error:", err);
    }
}

module.exports = mailsend;
