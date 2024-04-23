import { deleteSession } from "../session";

export function GET() {
  deleteSession();

  return new Response(null, {
    status: 302,
    headers: {
      location: "/",
      "set-cookie": "session=; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    },
  });
}
