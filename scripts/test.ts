import { sendEmail } from "@/lib/emailUtils";
import { PasswordResetEmail } from "@/emails/ResetPassword";

sendEmail({
  Email: PasswordResetEmail,
  to: "mail@jurivoelker.de",
  subject: "Passwort zurücksetzen",
  data: {},
}).then(() => console.info("Email sent!"));
