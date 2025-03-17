import { z } from "zod";
import { Resend } from "resend";
import "dotenv/config";

interface sendEmailProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Email: React.FC<any>;
  to: string;
  subject: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export const sendEmail = async ({
  Email,
  to,
  subject,
  data,
}: sendEmailProps) => {
  const { RESEND_API_KEY, RESEND_EMAIL_FROM } = process.env;
  const schema = z.object({
    RESEND_API_KEY: z.string().nonempty(),
    RESEND_EMAIL_FROM: z.string().nonempty(),
  });

  const result = schema.safeParse({ RESEND_API_KEY, RESEND_EMAIL_FROM });

  if (!result.success) {
    throw new Error(
      "Error while sending email:" + JSON.stringify(result.error.errors)
    );
  }
  const resend = new Resend(RESEND_API_KEY);
  await resend.emails.send({
    from: RESEND_EMAIL_FROM || "",
    to,
    subject,
    react: Email({ ...data }),
  });
};
