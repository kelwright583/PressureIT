"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { logoutAction } from "./actions/auth";
import {
  LayoutDashboard,
  Images,
  Wrench,
  Settings,
  MessageSquareQuote,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Before/After",
    href: "/admin/gallery",
    icon: <Images className="h-5 w-5" />,
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: <MessageSquareQuote className="h-5 w-5" />,
  },
  {
    label: "Quotes",
    href: "/admin/quotes",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-line hover:text-bone disabled:opacity-50"
    >
      <LogOut className="h-5 w-5" />
      <span>{pending ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  return pathname.startsWith(href);
}

export function AdminShell({
  pathname,
  userName,
  userRole,
  newQuoteCount = 0,
  children,
}: {
  pathname: string;
  userName: string | null;
  userRole: string;
  newQuoteCount?: number;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-ink">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-black transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 select-none"
          >
            <Image
              src="/brand/logo-primary.jpg"
              alt="Pressure-It"
              width={260}
              height={104}
              className="h-14 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/admin/quotes"
              className="relative rounded-lg p-1.5 text-muted hover:bg-line hover:text-bone"
              aria-label={`Notifications${newQuoteCount > 0 ? ` (${newQuoteCount} new)` : ""}`}
            >
              <Bell className="h-5 w-5" />
              {newQuoteCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
                  {newQuoteCount > 9 ? "9+" : newQuoteCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-muted hover:bg-line hover:text-bone lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                      ${
                        active
                          ? "bg-accent/10 text-accent"
                          : "text-muted hover:bg-line hover:text-bone"
                      }
                    `}
                  >
                    <span
                      className={
                        active
                          ? "text-accent"
                          : "text-muted group-hover:text-bone"
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/admin/quotes" && newQuoteCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-ink">
                        {newQuoteCount}
                      </span>
                    )}
                    {active && (
                      <ChevronRight className="h-4 w-4 text-accent/60" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-line p-3">
          {/* User info */}
          <div className="mb-3 rounded-lg bg-ink px-3 py-2.5">
            <p className="truncate text-sm font-medium text-bone">
              {userName ?? "Admin User"}
            </p>
            <p className="text-xs capitalize text-muted">{userRole}</p>
          </div>

          {/* Logout */}
          <form action={logoutAction}>
            <LogoutButton />
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-black px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-muted hover:bg-line hover:text-bone"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Image
            src="/brand/logo-primary.jpg"
            alt="Pressure-It"
            width={220}
            height={88}
            className="h-12 w-auto object-contain flex-1"
          />
          <Link
            href="/admin/quotes"
            className="relative rounded-lg p-1.5 text-muted hover:bg-line hover:text-bone"
            aria-label={`Notifications${newQuoteCount > 0 ? ` (${newQuoteCount} new)` : ""}`}
          >
            <Bell className="h-5 w-5" />
            {newQuoteCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
                {newQuoteCount > 9 ? "9+" : newQuoteCount}
              </span>
            )}
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-ink p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
