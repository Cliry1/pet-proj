import { BrevoClient } from "@getbrevo/brevo";
import { env } from "./env";

const brevo = new BrevoClient({
  apiKey: env("BREVO_API_KEY"),
});


export const sendMailBrevoApi = async (options)=>{
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      email: options.from,
      name: "PhoneBook",
    },
    to: [
      {
        email: options.email,
      },
    ],
    subject: options.subject,
    htmlContent: options.html,
  });
};

