const
    welcomeMsg_SUBJECT = 'Thanks for joining!',
    goodbyeMsg_SUBJECT = 'The Task Application Team is sorry to see you go!',
    DOMAIN_SENDER = process.env.DOMAIN_SENDER,
    apiKey = process.env.SENDGRID_API_KEY,
    sgMail = require('@sendgrid/mail');

sgMail.setApiKey(apiKey);

const
    _propercaseName = (str) => {
        return str.replace(/^\w/, char => char.toUpperCase());
    },
    _sendEmail = (msg) => {
        return sgMail.send(msg);
    },
    sendWelcomeEmail = (data) => {
        let { email, fName, lName } = data,
            firstName = _propercaseName(fName),
            lastName = _propercaseName(lName);
        const
            welcomeMsg = {
                to: email,
                from: DOMAIN_SENDER,
                subject: welcomeMsg_SUBJECT,
                text: `Hello ${firstName}, thanks for signing up! 
        
                    We have your account details as: 
                    Email: ${email}
                    First Name: ${firstName} 
                    Last Name: ${lastName}
        
                    Account details may be changed through the Services page of the Application.
                    We hope you enjoy its use!
                `
            };

        return _sendEmail(welcomeMsg);
    },
    sendGoodbyeEmail = (data) => {
    let
        { email, fName } = data,
        firstName = _propercaseName(fName);
    const
        goodbyeMsg = {
            to: email,
            from: DOMAIN_SENDER,
            subject: goodbyeMsg_SUBJECT,
            text: `Hello ${firstName}, we're sorry to see you go! 
        
                We have deleted all of your account information from our database.
        
                Would you mind taking a few minutes to let us know why you chose to discontinue using the app?
                You can provide feedback to our team here: abandonmentFeedback@taskAppHelp.com
                
                This will be our final correspondence with you. Thank you for your consideration!
            `
        };

    return _sendEmail(goodbyeMsg);
};

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
};