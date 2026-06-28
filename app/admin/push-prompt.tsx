"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, X } from "lucide-react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushPrompt() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [dismissed, setDismissed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);

    // Register service worker
    navigator.serviceWorker.register("/sw.js").catch(console.error);

    // Check if already dismissed this session
    if (sessionStorage.getItem("push-dismissed")) {
      setDismissed(true);
    }
  }, []);

  async function handleEnable() {
    setSubscribing(true);
    try {
      const reg = await navigator.serviceWorker.ready;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      // Send subscription to our API
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      setPermission("granted");
    } catch (err) {
      console.error("Push subscription failed:", err);
      setPermission(Notification.permission);
    } finally {
      setSubscribing(false);
    }
  }

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem("push-dismissed", "1");
  }

  // Don't show if already granted, denied, unsupported, or dismissed
  if (permission === "granted" || permission === "denied" || permission === "unsupported" || dismissed) {
    return null;
  }

  return (
    <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
      <Bell className="h-5 w-5 shrink-0 text-accent" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-bone">Enable notifications</p>
        <p className="text-xs text-muted">Get alerts for new quote requests on your phone</p>
      </div>
      <button
        onClick={handleEnable}
        disabled={subscribing}
        className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-ink hover:brightness-110 disabled:opacity-50"
      >
        {subscribing ? "..." : "Enable"}
      </button>
      <button
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1 text-muted hover:text-bone"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
