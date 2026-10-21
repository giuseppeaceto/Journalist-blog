"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link2, Share2 } from "lucide-react";

interface SocialShareProps {
  title: string;
  slug: string;
  variant?: "bar" | "card";
}

const emptySubscribe = () => () => {};

export function SocialShare({ title, slug, variant = "bar" }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [instagramNotice, setInstagramNotice] = useState(false);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const fallbackUrl = `https://www.nadiaclementi.it/articolo/${slug}`;
  const shareUrl = isClient && typeof window !== "undefined" ? window.location.href : fallbackUrl;
  const canNativeShare =
    isClient && typeof navigator !== "undefined" && typeof navigator.share === "function";
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  const handleInstagramClick = async (e: React.MouseEvent) => {
    // If mobile and Web Share API is available, try it (Instagram Stories/Direct can be picked)
    if (canNativeShare && typeof window !== "undefined" && window.innerWidth < 640) {
      e.preventDefault();
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
        return;
      } catch {
        // If cancelled or failed, continue with clipboard + Instagram open
      }
    }

    // Automatically copy the article link
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      // ignore
    }

    setInstagramNotice(true);
    setTimeout(() => setInstagramNotice(false), 4000);

    // On desktop, open Instagram in a new tab
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      e.preventDefault();
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }
  };

  const openSharePopup = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      e.preventDefault();
      window.open(
        href,
        "social-share-dialog",
        "width=620,height=560,resizable=yes,scrollbars=yes,status=no",
      );
    }
  };

  const shareChannels = [
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      ariaLabel: "Condividi su WhatsApp",
      colorClass:
        "hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 focus-visible:ring-[#25D366]",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M17.5 6.5A7.8 7.8 0 0 0 12 4.2C7.7 4.2 4.2 7.7 4.2 12c0 1.4.4 2.8 1.1 4L4 20l4.2-1.1c1.2.6 2.5 1 3.8 1 4.3 0 7.8-3.5 7.8-7.8 0-2.1-.8-4-2.3-5.6zm-5.5 12.1c-1.2 0-2.3-.3-3.3-.9l-.2-.1-2.5.7.7-2.4-.2-.3c-.7-1-1-2.2-1-3.5 0-3.6 2.9-6.5 6.5-6.5 1.7 0 3.4.7 4.6 1.9 1.2 1.2 1.9 2.9 1.9 4.6 0 3.6-2.9 6.5-6.5 6.5zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.7.8-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.4.1-.1.1-.2.2-.3 0-.1 0-.2-.1-.3s-.5-1.2-.7-1.6c-.2-.4-.4-.3-.5-.3h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.3.1.2 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.2-.5 1.4-1 .2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      ariaLabel: "Condividi su Facebook",
      colorClass:
        "hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 focus-visible:ring-[#1877F2]",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      ariaLabel: "Condividi su Instagram (copia link)",
      colorClass:
        "hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10 focus-visible:ring-[#E4405F]",
      onClick: handleInstagramClick,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      ariaLabel: "Condividi su X",
      colorClass:
        "hover:text-black hover:border-black/40 hover:bg-black/10 focus-visible:ring-black",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-3.5"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      ariaLabel: "Condividi su LinkedIn",
      colorClass:
        "hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 focus-visible:ring-[#0A66C2]",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      ariaLabel: "Condividi su Telegram",
      colorClass:
        "hover:text-[#229ED9] hover:border-[#229ED9]/40 hover:bg-[#229ED9]/10 focus-visible:ring-[#229ED9]",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      ),
    },
  ];

  if (variant === "card") {
    return (
      <aside className="my-10 rounded-2xl border border-line bg-card/80 p-5 backdrop-blur-xs sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
              Ti è piaciuto questo articolo?
            </p>
            <p className="mt-1 text-sm text-muted">
              Condividilo con i tuoi contatti o sui tuoi profili social.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {shareChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                onClick={channel.onClick ?? ((e) => openSharePopup(e, channel.href))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={channel.ariaLabel}
                className={`inline-flex size-10 items-center justify-center rounded-full border border-line bg-white/80 text-ink/75 transition shadow-2xs hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 ${channel.colorClass}`}
              >
                {channel.icon}
              </a>
            ))}

            {canNativeShare ? (
              <button
                type="button"
                onClick={handleNativeShare}
                aria-label="Condividi con le tue app"
                className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-white/80 text-ink/75 transition shadow-2xs hover:scale-105 hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Share2 className="size-4" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Link copiato negli appunti" : "Copia link articolo"}
              className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition shadow-2xs active:scale-95 focus:outline-none focus-visible:ring-2 ${
                copied
                  ? "border-emerald-600/40 bg-emerald-50 text-emerald-700"
                  : "border-line bg-white/80 text-ink/75 hover:border-accent/40 hover:bg-accent/10 hover:text-accent focus-visible:ring-accent"
              }`}
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Copiato!</span>
                </>
              ) : (
                <>
                  <Link2 className="size-3.5" aria-hidden="true" />
                  <span>Copia link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {instagramNotice && (
          <div className="mt-4 rounded-xl border border-[#E4405F]/30 bg-[#E4405F]/10 px-3.5 py-2 text-xs font-medium text-[#c13584] animate-rise">
            Link copiato negli appunti! Incollalo in una Storia o invialo in Direct su Instagram.
          </div>
        )}
      </aside>
    );
  }

  // Variant: "bar" (compact row)
  return (
    <div className="mt-5 border-y border-line/70 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          Condividi
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {shareChannels.map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              onClick={channel.onClick ?? ((e) => openSharePopup(e, channel.href))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={channel.ariaLabel}
              className={`inline-flex size-8 items-center justify-center rounded-full border border-line/80 bg-white/60 text-ink/70 transition hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 ${channel.colorClass}`}
            >
              {channel.icon}
            </a>
          ))}

          {canNativeShare ? (
            <button
              type="button"
              onClick={handleNativeShare}
              aria-label="Condividi con le tue app"
              className="inline-flex size-8 items-center justify-center rounded-full border border-line/80 bg-white/60 text-ink/70 transition hover:scale-105 hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Share2 className="size-3.5" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Link copiato" : "Copia link articolo"}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs transition active:scale-95 focus:outline-none focus-visible:ring-2 ${
              copied
                ? "border-emerald-600/40 bg-emerald-50 text-emerald-700"
                : "border-line/80 bg-white/60 text-ink/70 hover:border-accent/40 hover:bg-accent/10 hover:text-accent focus-visible:ring-accent"
            }`}
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-600" aria-hidden="true" />
                <span className="text-[11px] font-medium">Copiato!</span>
              </>
            ) : (
              <>
                <Link2 className="size-3" aria-hidden="true" />
                <span className="text-[11px] font-medium">Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {instagramNotice && (
        <div className="mt-2.5 rounded-lg border border-[#E4405F]/30 bg-[#E4405F]/10 px-3 py-1.5 text-xs text-[#c13584] animate-rise">
          Link copiato! Incollalo in una Storia o in Direct su Instagram.
        </div>
      )}
    </div>
  );
}
