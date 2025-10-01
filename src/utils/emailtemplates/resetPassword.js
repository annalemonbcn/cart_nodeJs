const passwordResetTemplate = (user, resetURL) => `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #8A33FD;">Reset Your Password</h2>
      <p>Hello ${user.firstName || ""},</p>
      <p>You are receiving this email because you (or someone else) requested a password reset for your account.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" 
           style="background-color: #8A33FD; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p>If the button doesn’t work, copy and paste the following URL into your browser:</p>
      <p style="word-break: break-all;"><a href="${resetURL}" style="color: #0D6EFD;">${resetURL}</a></p>

      <p>If you did not request a password reset, please ignore this email. Your account remains safe.</p>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 12px; color: #888;">© 2025 Anna Lemon BCN. All rights reserved.</p>
    </div>
  </div>
`;

const emailTemplates = {
  passwordResetTemplate,
};

export { emailTemplates };
