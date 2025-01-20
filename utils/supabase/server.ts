import { cookies } from "next/headers";

export function createClient(cookieStore: any) {
  return {
    cookies: {
      async getAll() {
        return (await cookieStore).getAll();
      },
      async setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            await (await cookieStore).set(name, value, options);
          }
        } catch {
          // Handle the case where `setAll` is called from a Server Component
          console.warn("setAll was called from a Server Component. This can be ignored.");
        }
      },
    },
  };
}