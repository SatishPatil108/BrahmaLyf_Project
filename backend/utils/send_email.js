import { createTransport } from "nodemailer";
import { SMTP_USER, SMTP_PASS, SMTP_SERVICE } from "../config/config.js";

// Create transporter once
const transporter = createTransport({
    service: SMTP_SERVICE,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

const sendMail = async (email, subject, htmlBody) => {
    try {
        const mailOptions = {
            from: SMTP_USER,
            to: email,
            subject,
            html: htmlBody
        };

        const result = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export default sendMail;