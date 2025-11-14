import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const sendEmail = async (det) => {
  // Configure mailgen
  const mailgen = new Mailgen({
    theme: "default",
    product: {
      name: "myapp",
      link: "https://myapp.com/"
    }
  });

  // Generate HTML + Plaintext email body
  const emailBody = mailgen.generate(det.mailgencontent);
  const emailText = mailgen.generatePlaintext(det.mailgencontent);

  // Create transporter
 const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e33a33136d54ec", // from Mailtrap dashboard
    pass:"1f39101cd493b2" // from Mailtrap dashboard
  }
});


  // Define message
  const message = {
    from: "yourgmail@gmail.com",
    to: det.email,             // ✅ dynamic receiver
    subject: det.subject,      // ✅ dynamic subject
    html: emailBody,
    text: emailText
  };

  try {
    await transporter.sendMail(message);
    console.log("✅ Email sent successfully to:", det.email);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

