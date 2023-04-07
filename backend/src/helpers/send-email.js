const nodemailer = require("nodemailer");
const { InternalServerError } = require("../errorHandler/customErrorHandlers");

require("dotenv").config();
var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASS}`,
    },
    tls: { rejectUnauthorized: false },
});

const registerMail = (email,name,username) => {
    let mailoptionsuccess = {
        from: {
            name: "WildLife",
            address: process.env.EMAIL
        },
        to: email,
        subject: "Registration successful",
        html: `<p>Hi ${name},</p>
        <p>You have been successfully registered on WildLife. Please use username: <b>${username}</b> for login.</p>`
    };

    const mailsend = transporter
        .sendMail(mailoptionsuccess)
        .then((info) => {
            return info;
        })
        .catch((err) => {
            throw new InternalServerError(
                "Email cannot send, please try again in some time"
            );
        });

    return mailsend;
};

const signupApprovalMail = (email,name,status) => {
    let mailoptionsuccess = {
        from: {
            name: "WildLife",
            address: process.env.EMAIL
        },
        to: email,
        subject: "Sigup Access Status",
        html: `<p>Hi ${name},</p>
        <p>This mail is to inform you that your signup access status is ${status}</p>`
    };

    const mailsend = transporter
        .sendMail(mailoptionsuccess)
        .then((info) => {
            return info;
        })
        .catch((err) => {
            console.log(err)
            throw new InternalServerError(
                "Email cannot send, please try again in some time"
            );
        });

    return mailsend;
};

//reset password mail
const resetMail = (email,name,password) => {
    let mailoptionsuccess = {
        from: {
            name: "WildLife",
            address: process.env.EMAIL
        },
        to: email,
        subject: "Reset password",
        html: `<p>Hi ${name},</p>
        <p>
        To Please use password: <span style="background-color:DodgerBlue;">${password}</span> for login.
        </p>        
        <p>If you did not request this email you can safely ignore it.</p>`
    };

    const mailsend = transporter
        .sendMail(mailoptionsuccess)
        .then((info) => {
            return info;
        })
        .catch((err) => {
            throw new InternalServerError(
                "Email cannot send, please try again in some time"
            );
        });

    return mailsend;
};

//data export
const dataExportMail = (email,name,file) => {
    let mailoptionsuccess = {
        from: {
            name: "WildLife",
            address: process.env.EMAIL
        },
        to: email,
        subject: "Data export in CSV",
        html: `<p>Hi ${name},</p>
        <p>
        Thank you for the request,Please find the attached CSV file.
        </p> `,
        attachments:[{
            filename:"dataExport.csv",
            content:file
        }]      
    };

    const mailsend = transporter
        .sendMail(mailoptionsuccess)
        .then((info) => {
            return info;
        })
        .catch((err) => {
            throw new InternalServerError(
                "Email cannot send, please try again in some time"
            );
        });

    return mailsend;
};

module.exports = {
    registerMail,
    signupApprovalMail,
    resetMail,
    dataExportMail
}