const nodemailer = require("nodemailer");
require("dotenv").config();

async function connectMail() {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'ppvarmajobs@gmail.com',
                pass: 'jzfa hfxt zaxz okey',
            },
        });

        return transporter;
    } catch (err) {
        console.error("Mailer error:", err);
    }
}

module.exports = { connectMail };


// const msgtext = {
//     from: 'ppvarmajobs@gmail.com',
//     to: 'hekav26481@potatod.com',
//     subject: 'Test mail',
//     text: 'Hello'
// };

// async function Sendmail() {
//     const transport = await connect();
//     transport.sendMail(msgtext, (err, info) => {
//         if (err) {
//             console.log('Error:', err);
//         } else {
//             console.log('Email sent successfully:', info.response);
//         }
//     });
// }
