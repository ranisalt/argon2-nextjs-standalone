"use server";
import { z } from "zod";
import { createSession, verifyPassword } from "../session";

const email = "user@email.com";

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

  if (!(await verifyPassword(data.password))) {
    return { errors: { password: ["Incorrect password."] } };
  }

  await createSession();
  // Call the provider or db to create a user...
}
