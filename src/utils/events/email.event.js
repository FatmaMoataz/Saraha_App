import { EventEmitter } from "node:events";
import { verifyEmailTemplate } from "../email/templates/verify.email.template.js";

export const emailEvent = new EventEmitter()

emailEvent.on("Confirm email", async(data)=> {
    await sendEmail({to: data.to, subject:data.subject || "Confirm email",
         html:verifyEmailTemplate({otp:data.otp})}).catch(error => {
        console.log(`Failed to send email to ${data.to}`);
        
    })
})

emailEvent.on("SendForgotPassword", async(data)=> {
    await sendEmail({to: data.to, subject:data.subject || "Forgot email",
         html:verifyEmailTemplate({otp:data.otp, title:data.title})}).catch(error => {
        console.log(`Failed to send email to ${data.to}`);
        
    })
})
