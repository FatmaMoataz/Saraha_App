import nodemailer from 'nodemailer'

export async function sendEmail({   from=process.env.APP_EMAIL,to="",
    cc="",
    bcc="",
    subject="Saraha App",
    text="", 
    html="", attachments=[]}={}) {
    
const transporter = nodemailer.createTransport({
 service:'gmail', tls:{rejectUnauthorized:false},
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

  const info = await transporter.sendMail({
    from: `"Route Academy" <${from}>`,
    to,
    cc,
    bcc,
    subject,
    text, 
    html, attachments
  });

  // console.log("Message sent:", info.messageId);
}