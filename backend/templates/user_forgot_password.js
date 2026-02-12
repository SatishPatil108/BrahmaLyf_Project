export const passwordEmailBody = `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear User,</p>

    <p>
      I hope this email finds you well. Your privacy and the security of your 
      information are our top priorities. We strongly recommend not sharing 
      your credentials with anyone.
    </p>

    <p>Your password for user login is:</p>

    <div style="
      width: 300px;
      margin: 20px auto;
      padding: 15px;
      background-color: #d8ecff;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      border-radius: 6px;">
      $1
    </div>

    <p>Thank you!<br/>Best regards,<br/><strong>Bramhmind Team</strong></p>
  </body>
</html>
`;