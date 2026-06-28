"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save, Loader2, Plus, X, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { updateSettings } from "@/app/admin/actions/settings";
import type { SiteSettings, StatItem } from "@/db/types";

interface SettingsFormProps {
  settings: SiteSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [pending, startTransition] = useTransition();

  // Hero
  const [heroEyebrow, setHeroEyebrow] = useState(settings.hero_eyebrow);
  const [heroLine1, setHeroLine1] = useState(settings.hero_line1);
  const [heroLine2, setHeroLine2] = useState(settings.hero_line2);
  const [heroLine3, setHeroLine3] = useState(settings.hero_line3);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.hero_subtitle);
  const [heroImage, setHeroImage] = useState(settings.hero_image ?? "");

  // Contact
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebook_url);

  // Service areas
  const [serviceAreas, setServiceAreas] = useState<string[]>(
    settings.service_areas ?? []
  );
  const [areaInput, setAreaInput] = useState("");

  // Stats
  const [stats, setStats] = useState<StatItem[]>(settings.stats ?? []);

  function addArea() {
    const trimmed = areaInput.trim();
    if (trimmed && !serviceAreas.includes(trimmed)) {
      setServiceAreas([...serviceAreas, trimmed]);
    }
    setAreaInput("");
  }

  function removeArea(index: number) {
    setServiceAreas(serviceAreas.filter((_, i) => i !== index));
  }

  function addStat() {
    setStats([...stats, { label: "", value: 0, suffix: "" }]);
  }

  function updateStat(index: number, field: keyof StatItem, val: string) {
    const updated = [...stats];
    if (field === "value") {
      updated[index] = { ...updated[index], value: Number(val) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: val };
    }
    setStats(updated);
  }

  function removeStat(index: number) {
    setStats(stats.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();
    formData.set("hero_eyebrow", heroEyebrow);
    formData.set("hero_line1", heroLine1);
    formData.set("hero_line2", heroLine2);
    formData.set("hero_line3", heroLine3);
    formData.set("hero_subtitle", heroSubtitle);
    formData.set("hero_image", heroImage);
    formData.set("phone", phone);
    formData.set("email", email);
    formData.set("whatsapp", whatsapp);
    formData.set("facebook_url", facebookUrl);
    formData.set("service_areas", JSON.stringify(serviceAreas));
    formData.set(
      "stats",
      JSON.stringify(
        stats.map((s) => ({
          label: s.label,
          value: s.value,
          ...(s.suffix ? { suffix: s.suffix } : {}),
        }))
      )
    );

    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  const sectionClass =
    "space-y-4 rounded-xl border border-line bg-ink-soft p-5 sm:p-6";
  const inputClass =
    "w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelClass = "mb-1.5 block text-sm font-medium text-bone";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl tracking-tight text-accent sm:text-4xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Edit your homepage content and contact information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero section */}
        <section className={sectionClass}>
          <h2 className="font-display text-lg tracking-tight text-bone">
            Hero Section
          </h2>

          <div>
            <label htmlFor="hero_eyebrow" className={labelClass}>
              Eyebrow Text
            </label>
            <input
              id="hero_eyebrow"
              type="text"
              value={heroEyebrow}
              onChange={(e) => setHeroEyebrow(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="hero_line1" className={labelClass}>
                Line 1
              </label>
              <input
                id="hero_line1"
                type="text"
                value={heroLine1}
                onChange={(e) => setHeroLine1(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hero_line2" className={labelClass}>
                Line 2
              </label>
              <input
                id="hero_line2"
                type="text"
                value={heroLine2}
                onChange={(e) => setHeroLine2(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hero_line3" className={labelClass}>
                Line 3
              </label>
              <input
                id="hero_line3"
                type="text"
                value={heroLine3}
                onChange={(e) => setHeroLine3(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="hero_subtitle" className={labelClass}>
              Subtitle
            </label>
            <input
              id="hero_subtitle"
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <ImageUploader
            value={heroImage}
            onChange={setHeroImage}
            folder="hero"
            label="Hero Background Image"
          />
        </section>

        {/* Contact section */}
        <section className={sectionClass}>
          <h2 className="font-display text-lg tracking-tight text-bone">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className={labelClass}>
                WhatsApp Number
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="27821234567"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="facebook_url" className={labelClass}>
                Facebook URL
              </label>
              <input
                id="facebook_url"
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Service areas */}
        <section className={sectionClass}>
          <h2 className="font-display text-lg tracking-tight text-bone">
            Service Areas
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={areaInput}
              onChange={(e) => setAreaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArea();
                }
              }}
              placeholder="e.g. Sandton"
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="button"
              onClick={addArea}
              className="flex items-center gap-1 rounded-xl border border-line bg-ink px-4 py-3 text-sm font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {serviceAreas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink px-3 py-1.5 text-xs font-medium text-bone"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => removeArea(index)}
                    className="rounded-full p-0.5 text-muted transition-colors hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Stats */}
        <section className={sectionClass}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg tracking-tight text-bone">
              Stats
            </h2>
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-1 rounded-lg border border-line bg-ink px-3 py-2 text-xs font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Stat
            </button>
          </div>

          {stats.length === 0 && (
            <p className="text-sm text-muted">No stats configured.</p>
          )}

          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-lg border border-line bg-ink p-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-muted">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) =>
                      updateStat(index, "label", e.target.value)
                    }
                    placeholder="e.g. Years Experience"
                    className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1 block text-xs font-medium text-muted">
                    Value
                  </label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) =>
                      updateStat(index, "value", e.target.value)
                    }
                    className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1 block text-xs font-medium text-muted">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={stat.suffix ?? ""}
                    onChange={(e) =>
                      updateStat(index, "suffix", e.target.value)
                    }
                    placeholder="e.g. +"
                    className="w-full rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="flex h-9 items-center justify-center rounded-lg border border-line bg-ink px-3 text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-accent/90 disabled:opacity-50 sm:w-auto"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </button>
      </form>
    </div>
  );
}
