import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome To Chatify",
    html: createWelcomeEmailTemplate(name, clientURL),
  
  });

  // check for error
  if ( error ) {
    console.error('Error Sending Welcome Email:', error);
    throw new Error('Failed to send welcome email');
  }

  console.log('Welcome Email Sent Successfully', data);
}