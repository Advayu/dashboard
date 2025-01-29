// import nodemailer from 'nodemailer';

// export const sendOtpEmail = async (email: string, otp: string) => {
//   try {
//     // Create a transporter object with the necessary SMTP settings
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com"
//       port: Number(process.env.EMAIL_PORT), // e.g., 587
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: process.env.EMAIL_USER || "MS_m1UNhO@trial-neqvygmywnjg0p7w.mlsender.net", // your email address
//         pass: process.env.EMAIL_PASSWORD || "6hUPBUaBsGvetESU" , // your email password
//       },
//     });

//     // Set up email data with unicode symbols
//     const mailOptions = {
//       // from: `"Advayu" <dev@advayu.club>`, // sender address
//       from: `"Advayu" <${process.env.EMAIL_FROM}>`, // sender address
//       to: email, // list of receivers
//       subject: 'Your Verification OTP', // Subject line
//       text: `Your OTP code is ${otp}`, // plain text body
//       html: `<b>Your OTP code is ${otp}</b>`, // HTML body
//     };

//     // Send mail with defined transport object
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Message sent: %s', info.messageId);

//   } catch (error) {
//     console.error('Error sending email: ', error);
//     throw new Error('Unable to send email');
//   }
// };

// import { render } from '@react-email/render';
// import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
// // import { Email } from '../components/emailTemplates/email';


// const mailerSend = new MailerSend({
//   apiKey: process.env.MAILERSEND_API_KEY || '',
// });
// const mailerDomain =  process.env.EMAIL_USER || ''

// // const emailHtml = render(<Email url="https://example.com" />);

// export const sendOtpEmail = async (email: string, otp: string) => {
// const sentFrom = new Sender( mailerDomain, "Your name");
// const recipients = [
//   new Recipient(email, "Your Client")
// ];

// const emailParams = new EmailParams()
//   .setFrom(sentFrom)
//   .setTo(recipients)
//   .setSubject(`your verification code is ${otp}`)
//   // .setHtml(emailHtml)

// mailerSend.email.send(emailParams);
// }


