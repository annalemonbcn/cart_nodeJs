import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is missing");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || "annalemonbcn.dev@gmail.com";
const FROM_NAME = process.env.MAIL_FROM_NAME || "Anna Lemon BCN";

const sendMail = async (msg) => {
  const base = {
    from: { email: FROM_EMAIL, name: FROM_NAME },
    trackingSettings: { clickTracking: { enable: false } },
    mailSettings: { bypassListManagement: { enable: true } },
  };

  await sgMail.send({ ...base, ...msg });
};

export { sendMail };
