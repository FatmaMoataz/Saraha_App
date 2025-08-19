import path from 'node:path'
import * as dotenv from 'dotenv'
dotenv.config({path: path.join('./src/config/.env.dev')})
// dotenv.config({})
import express from 'express'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import messageController from './modules/message/message.controller.js'
import connectDB from './DB/connection.db.js'
import { globalErrorHandling } from './utils/response.js'
import cors from 'cors'
import { sendEmail } from './utils/email/send.email.js'
import { verifyEmailTemplate } from './utils/email/templates/verify.email.template.js'
import './jobs/cron.job.js'
import morgan from 'morgan'
import helmet from 'helmet'
import {rateLimit} from 'express-rate-limit'


const bootstrap = async() => {
    
const app = express()
const port = process.env.PORT || 5000
// const whitelist = process.env.ORIGINS.split(",")
// app.use(async (req, res, next) => {
//         if (!whitelist.includes(req.header('origin'))) {
//             return next(new Error('Not Allowed By CORS', { cause: 403 }))
//         }
//         for (const origin of whitelist) {
//             if (req.header('origin') == origin) {
//                 await res.header('Access-Control-Allow-Origin', origin);
//                 break;
//             }
//         }
//         await res.header('Access-Control-Allow-Headers', '*')
//         await res.header("Access-Control-Allow-Private-Network", 'true')
//         await res.header('Access-Control-Allow-Methods', '*')
//         console.log("Origin Work");
//         next();
//     });
// cors
// var whitelist = process.env.ORIGINS.split(",")
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
app.use(cors())
app.use(helmet())
const limiter = rateLimit({
    // 1min
    windowMs:60*1000,
    limit:3,
    message:{error:"Too many requests"},
    standardHeaders:'draft-8'
})
app.use(limiter)
app.use(morgan('dev'))
// DB
await connectDB()
app.use('/uploads', express.static(path.resolve('./src/uploads')))
// convert buffer data
app.use(express.json())
// app routes
app.get('/', (req, res) => res.json({message:"Welcome to app"}))
app.use('/auth', authController)
app.use('/user', userController)
app.use('/message', messageController)
app.all('{/*dummy}', (req, res) => res.status(404).json({message:"Not Found"}))
app.use(globalErrorHandling)
await sendEmail({to:"fatmamoataz65@gmail.com", html: verifyEmailTemplate({ otp: Date.now() })})
app.listen(port, () => console.log(`App is listening on port ${port}`)
)
}

export default bootstrap