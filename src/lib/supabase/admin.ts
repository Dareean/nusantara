import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function getEnv(key: string): string {
  if (process.env[key]) return process.env[key]!;
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
      if (match) {
        const val = match[1].trim().replace(/^['"](.*)['"]$/, "$1");
        process.env[key] = val;
        return val;
      }
    }
  } catch {}
  return "";
}

export function createAdminClient() {
  const rawUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL") || "https://viernrozdpdslkgwfytl.supabase.co";
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "");
  const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(
    url,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
