import "dotenv-flow/config";
import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

const apiKey = apiInstance.authentications["apiKey"];
if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is missing");
}
apiKey.apiKey = process.env.BREVO_API_KEY;

const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || "annalemonbcn.dev@gmail.com";
const FROM_NAME = process.env.MAIL_FROM_NAME || "Anna Lemon BCN";

const sendBrevoMail = async ({ to, templateId, dynamicTemplateData }) => {
  const email = {
    to: [{ email: to }],
    templateId: Number(templateId),
    params: dynamicTemplateData,
    sender: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
  };

  await apiInstance.sendTransacEmail(email);
};

export { sendBrevoMail };
