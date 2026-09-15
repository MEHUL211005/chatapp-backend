const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInvitationEmail = async ({
  email,
  name,
  invitationLink,
}) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "You're invited to join Chat App",
    html: `
      <h2>Hello ${name},</h2>

      <p>You have been invited to join our Chat App.</p>

      <p>
        Click the button below to accept your invitation
        and set your password.
      </p>

      <a href="${invitationLink}">
        Accept Invitation
      </a>

      <p>
        This invitation link will expire in 24 hours.
      </p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  sendInvitationEmail,
};