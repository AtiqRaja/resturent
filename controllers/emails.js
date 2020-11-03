const express = require('express');
var nodemailer = require("nodemailer");
var moment = require("moment");

let transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'info@asumanuae.com', // generated gmail user
        pass: 'Asuman@321' // generated gmail account password
    },
    tls: { rejectUnauthorized: false }
});


class mdco_emails {

    contact_us_mail(name, from, msg, phone) {
        // Generate test SMTP service account from gmail
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'Asuman Contact Form <info@asumanuae.com>',
                to: 'info@asumanuae.com', // list of receivers 
                subject: "Contact Form - From " + name, // Subject line
                text: '', // plain text body
                html: name+' filled the contact form with following details : '+
                    '<br>Name : '+ name+
                    '<br>Mobile :'+ phone+
                    '<br>Email :'+ from+
                    '<br>Message : ' + msg
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            });
        });
    }

    celebration_mail(name, from, msg, phone, noOfPerson, date) {
        // Generate test SMTP service account from gmail
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'Celebration Form <info@asumanuae.com>',
                to: 'info@asumanuae.com', // list of receivers 
                subject: "Celebration Form - From " + name, // Subject line
                text: '', // plain text body
                html: name+' filled the celebration request with following details : '+
                    '<br>Name : '+ name+
                    '<br>Mobile :'+ phone+
                    '<br>Email :'+ from+
                    '<br>No Of Person :'+ noOfPerson+
                    '<br>Date :'+ date+
                    '<br>Message : ' + msg
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            });
        });
    }


}

module.exports = new mdco_emails();
