"use server";
import { z } from "zod";
import { createSession, verifyPassword } from "../session";

const email = "user@email.com";
// password = 'password'
const password =
  "$argon2id$v=19$m=65536,t=3,p=4$2l+ZIidufdSmtl0T6dm9Dg$7CzyP7OUyLsGVwmtXuphqGeapw+nuJnTvJ3b/ios7bo";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().trim(),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function login(state: FormState, formData: FormData) {
  // Validate form fields
  const { data, error, success } = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!success) {
    return { errors: error.flatten().fieldErrors };
  }

  if (data.email !== email) {
    return { errors: { email: ["Email not found."] } };
  }

  if (!(await verifyPassword(data.password, password))) {
    return { errors: { password: ["Incorrect password."] } };
  }

  await createSession();
  // Call the provider or db to create a user...
}
