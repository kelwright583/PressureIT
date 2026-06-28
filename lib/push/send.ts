import webPush from "web-push";
import { createServiceClient } from "@/lib/supabase/server";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

export async function sendPushToAdmins(payload: {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn("[push] VAPID keys not configured, skipping push");
    return;
  }

  webPush.setVapidDetails(
    "mailto:sharon@pressure-it.co.za",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );

  const supabase = await createServiceClient();

  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("endpoint, keys_p256dh, keys_auth");

  if (!subscriptions || subscriptions.length === 0) return;

  const message = JSON.stringify(payload);

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys_p256dh,
            auth: sub.keys_auth,
          },
        },
        message
      )
    )
  );

  // Clean up expired subscriptions (410 Gone)
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "rejected" && "statusCode" in result.reason) {
      const statusCode = (result.reason as { statusCode: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", subscriptions[i].endpoint);
      }
    }
  }
}
