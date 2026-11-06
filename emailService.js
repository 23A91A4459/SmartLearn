
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendPasswordResetEmail(email, resetLink) {
  await transporter.sendMail({
    from: `"SmartLearn" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your SmartLearn Password",
    text: `You requested a password reset for your SmartLearn account.

Open this link to reset your password:
${resetLink}

This link expires in 15 minutes. If you did not request this, ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px;">
        <h2 style="color: #8b5cf6;">SmartLearn Password Reset</h2>
        <p>We received a request to reset your SmartLearn password.</p>
        <p>
          <a href="${resetLink}"
             style="display: inline-block; padding: 12px 20px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 8px;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
  console.log("Configured SmartLearn sender:", process.env.EMAIL_USER);
}

module.exports = { sendPasswordResetEmail };
