import { formSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const useMailForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      subject: "",
      email: "",
      content: "",
      file: undefined,
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { username, email, subject, content, file } = values;

      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("content", content);
      formData.append("file", file[0]);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/send`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("送信に失敗しました");
        }

        form.reset(); // フォームをリセット

        // ファイル入力をクリア
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }

        return true; // 成功を示す
      } catch (err) {
        console.error(err);
        return false; // 失敗を示す
      }
    },
    [form]
  );

  return { form, onSubmit };
};
