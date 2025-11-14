const mailverificationmailgencontent = (username, verificationurl) => {
  return {
    body: {
      name: username,
      intro: "Welcome! We are happy to see you on board.",
      action: {
        instructions: "Press the button below to verify your email:",
        button: {
          color: "#22BC66",
          text: "Click to Verify",
          link: verificationurl
        }
      },
      outro: "Need help? Just reply to this email."
    }
  };
};

const resetpasswordmailgencontent = (username, reseturl) => {
  return {
    body: {
      name: username,
      intro: "You requested to reset your password.",
      action: {
        instructions: "Press the button below to reset your password:",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: reseturl
        }
      },
      outro: "If you didn’t request this, please ignore this email."
    }
  };
};

export { mailverificationmailgencontent, resetpasswordmailgencontent };
