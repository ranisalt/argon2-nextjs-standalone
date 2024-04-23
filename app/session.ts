import "server-only";
import { cookies } from "next/headers";
import * as argon2 from "argon2";

export function createSession() {
  cookies().set("session", "yes");
}

export function deleteSession() {
  cookies().delete("session");
}

export async function verifyPassword(password: string) {
  const hash = await argon2.hash('password');
  return await argon2.verify(hash, password);
}
