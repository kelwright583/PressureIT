function env(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

export const config = {
  supabase: {
    url: env("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: () => env("SUPABASE_SERVICE_ROLE_KEY"),
  },
  resend: {
    apiKey: () => env("RESEND_API_KEY"),
    quoteNotifyTo: env("QUOTE_NOTIFY_TO", "sharon@pressure-it.co.za"),
    quoteFromEmail: env("QUOTE_FROM_EMAIL", "quotes@pressure-it.co.za"),
  },
  app: {
    siteUrl: env("NEXT_PUBLIC_SITE_URL", "https://www.pressure-it.co.za"),
    revalidateSecret: process.env.REVALIDATE_SECRET,
  },
} as const;
