import nodemailer from 'nodemailer'
import { ADMIN_EMAIL, EMAIL_PASSWORD } from './env.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ADMIN_EMAIL,
        pass: EMAIL_PASSWORD,
    }
})

export default transporter;