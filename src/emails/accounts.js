const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = 'test'

sgMail.setApiKey(sendgridAPIKey)

const msg = {
    to: 'linhthuynguyen2812@gmail.com', // Change to your recipient
    from: 'nguyen44@miamioh.edu', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })