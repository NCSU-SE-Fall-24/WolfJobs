const mailer = require('nodemailer');

exports.sendMail = async (to, subject, text1)=>{
  console.log('kcne', to);

  const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // 465 for ssl
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'kenilpatel221102@gmail.com',
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions ={
    from: 'kenilpatel221102@gmail.com',
    to: to,
    subject: subject,
    text: text1,
  };
  transporter.sendMail(mailOptions, (err, info)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
// sendMail('keniltempmail@gmail.com',"new mail for you")
