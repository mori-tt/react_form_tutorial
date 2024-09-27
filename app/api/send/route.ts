import { EmailTemplate } from "@/components/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL as string;
const toEmail = process.env.RESEND_TO_EMAIL as string;

if (!fromEmail || !toEmail) {
  throw new Error("送信元または送信先のメールアドレスが設定されていません。");
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const file = formData.get("file") as File;

  //   console.log(username, email, subject, content, file);

  const buffer = Buffer.from(await file.arrayBuffer());

  //   console.log(buffer);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: subject,
      react: EmailTemplate({
        username,
        email,
        content,
      }) as React.ReactElement,
      attachments: [{ filename: file.name, content: buffer }],
    });
    if (error) {
      return NextResponse.json(error);
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
