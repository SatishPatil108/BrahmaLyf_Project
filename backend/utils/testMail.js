import { createTransport } from 'nodemailer';

async function sendTestMail() {
  try {
    const transporter = createTransport({
      host: "smtp.office365.com", // use office365 SMTP for company email
      port: 587,
      secure: false,
      auth: {
        user: "shiva.bhosale@bitcode.co.in",
        pass: "juuq flpq puvt gjoj" // your app password
      }
    });

    const mailOptions = {
      from: "shiva.bhosale@bitcode.co.in",
      to: "shivajibhosale9996@gmail.com",  // send to your personal email
      subject: "Password Test Email",
      html: `
        <div> 
          <h2>Test Password Mail</h2>
          <p>Your new password is: <b>Test@1234</b></p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending test mail:", error.response || error.message || error);
  }
}

sendTestMail();
